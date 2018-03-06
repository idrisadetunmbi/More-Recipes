import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import models from '../models';

dotenv.config({ path: `${__dirname}/../../.env` });

/**
 *
 *
 * @export
 * @class UserController
 */
export default class UserController {
  /**
   * Gets all the users from the database
   * @memberOf UserController
   * @param {Object} req
   * @param {Object} res
   *
   * @returns {Promise} returns an object
   */
  getAllUsers = async (req, res) => {
    let users;
    try {
      users = await models.user.all();
    } catch (error) {
      return res.status(500).send({
        message: 'unhandled internal error',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      message: 'all users',
      data: users,
    });
  }

  /**
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   *
   * @returns {Promise} express response object
   * @memberOf UserController
   */
  createUser = async (req, res) => {
    let user;
    try {
      user = await models.user.create(req.body);
    } catch (error) {
      return res.status(400).send({
        message: 'username or email already exist',
        error: error.errors[0].message || error.message,
      });
    }
    const { password, updatedAt, ...userDetails } = user.get();
    const token = jwt.sign(
      { userId: userDetails.id },
      process.env.JWT_AUTH_SECRET,
      { expiresIn: '7d' },
    );
    return res.status(201).send({
      message: 'user signup is successful',
      data: { ...userDetails, token },
    });
  }

  /**
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   *
   * @returns {Promise} express response object
   * @memberOf UserController
   */
  updateUserImageUrl = async (req, res) => {
    // user is an instance of User Model (Sequelize model)
    const { user } = req;
    try {
      await user.update({
        imageUrl: req.body.imageUrl,
      });
    } catch (error) {
      return res.status(500).send({
        message: 'an error occured while trying to perform this request',
        error: error.message,
      });
    }

    // remove password from user details to be returned
    const { password, ...otherDetails } = user.get();
    return res.status(200).send({
      message: 'image url updated successfully',
      data: otherDetails,
    });
  }

  /**
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   *
   * @returns {Promise} express response object
   * @memberOf UserController
   */
  signInUser = async (req, res) => {
    let user;
    try {
      // eslint-disable-next-line
      user = await models.user.findOne({ where: { username: req.body.username } });
    } catch (error) {
      return res.status(400).send({
        message: 'an error occured while trying to complete the request',
        error: error.errors[0].message || error.message,
      });
    }
    if (!user) {
      return res.status(401).send({
        error: 'wrong username or password',
      });
    }
    // if password is not correct
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        error: 'wrong username or password',
      });
    }
    const { password, updatedAt, ...userDetails } = user.get();
    const token = jwt.sign(
      { userId: userDetails.id },
      process.env.JWT_AUTH_SECRET,
      { expiresIn: '7d' },
    );
    return res.status(200).send({
      message: 'you have successfully signed in',
      data: { ...userDetails, token },
    });
  }

  /**
   * Gets the recipes authored by a user
   * @memberOf UserController
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   *
   * @returns {Promise} return object from res.send
   */
  getUserRecipes = async (req, res) => {
    let user;
    try {
      user = await models.user.findById(req.params.userId, {
        attributes: ['id', 'username', 'email'],
        include: [{
          model: models.recipe,
          as: 'recipes',
        }],
      });
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      message: 'user\'s recipes',
      data: user,
    });
  }

  /**
   * Gets the favorite recipes of a user
   * @memberOf UserController
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   *
   * @returns {Promise} return object from res.send
   */
  getUserFavorites = async (req, res) => {
    let userFavorites;
    try {
      userFavorites = await models.favorite.findAll({
        where: {
          userId: req.params.userId,
        },
        attributes: ['recipeId'],
      });
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }

    const favorites = userFavorites.map(entry => entry.recipeId);
    return res.status(200).send({
      message: 'user\'s favorites',
      data: favorites,
    });
  }

  /**
   * Gets the authenticated user's vote statuses/favorite status on a recipe
   * @memberOf UserController
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   *
   * @returns {Promise} express res object
   */
  getRecipeVoteStatuses = async (req, res) => {
    const { params: { recipeId }, user } = req;
    const voteStatuses = {};
    try {
      voteStatuses.upvoted = await user
        .hasVotedRecipe(recipeId, { through: { where: { type: 'upvote' } } });
      voteStatuses.downvoted = await user
        .hasVotedRecipe(recipeId, { through: { where: { type: 'downvote' } } });
      voteStatuses.favorited = await user
        .hasFavoriteRecipe(recipeId);
    } catch (error) {
      return res.status(500).send({
        message: 'Internal server error',
        error: error.message,
      });
    }
    return res.status(200).send({
      data: voteStatuses,
    });
  }
}

