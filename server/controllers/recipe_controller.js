import validate, { validationResult } from 'express-validator/check';
import ReviewService from '../services/ReviewService';
import RecipesService from '../services/RecipesService';

import models from '../models/sequelize_models';

const RecipeModel = models.recipe;
const ReviewModel = models.review;

export default class RecipeController {
  /**
   * Array storing validations for a POST recipe request
   */
  recipePostValidationChecks = [
    validate.body('title', 'title must be between 5 to 50 characters')
      .isLength({ min: 5, max: 50 }).not().isInt()
      .trim(),
    validate.body('description', 'you must add a description').isLength({ min: 5 }).trim().escape(),
    validate.body('ingredients', 'ingredients must be included').isLength({ min: 5 }).trim().escape(),
    validate.body('directions', 'directions are required for a recipe').isLength({ min: 5 }).trim().escape(),
  ];

  /**
   * Stores validation for a GET request
   */
  recipeGetValidationChecks = [
    validate.param('recipeId', 'recipe id is invalid or stated recipe does not exist').isUUID()
      .custom(value => RecipeModel.findById(value)),
  ];

  recipePutValidationChecks = [
    validate.body('title', 'title must be between 5 to 50 characters')
      .isLength({ min: 5, max: 50 }).not().isInt()
      .optional()
      .trim(),
    validate.body('description', 'you must add a description').isLength({ min: 5 }).optional().trim()
      .escape(),
    validate.body('ingredients', 'ingredients must be included').isLength({ min: 5 }).optional().trim()
      .escape(),
    validate.body('directions', 'directions are required for a recipe').isLength({ min: 5 }).optional().trim()
      .escape(),
  ];

  reviewPostValidationChecks = [
    validate.body('review', 'you must add a review with at least 5 characters').isLength({ min: 5 }),
    // validate.param('recipeId', 'invalid recipe id or recipe does not exist').isUUID(),
    validate.body('stars', 'recipe can only be rated between 1 to 5').isInt({ min: 1, max: 5 }).optional().trim(),
    // .custom((value, { req }) => RecipesService.getRecipe(value)),
  ];

  /**
   * Adds a new recipe
   * @param()
   */
  postRecipe = async (req, res) => {
    let recipe;
    try {
      recipe = await RecipeModel.create({
        ...req.body, creatorId: req.user.id,
      });
    } catch (error) {
      return res.status(400).send({
        message: 'user does not exist',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(201).send({
      message: 'Recipe created successfully',
      data: { ...req.body, id: recipe.id, creator: req.user.username },
    });
  }

  getRecipes = async (req, res) => {
    let recipes;
    try {
      recipes = await RecipeModel.findAll({
        include: [{ model: models.user, as: 'creator', attributes: ['username'] }],
      });
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      data: recipes,
    });
  }

  /**
   * Gets a single recipe from the database
   */
  getRecipe = async (req, res) => {
    let recipe;
    try {
      recipe = await RecipeModel.findById(req.params.recipeId, {
        include: [{ model: models.user, as: 'creator', attributes: ['username'] }],
      });
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      data: recipe,
    });
  }

  putRecipe = async (req, res) => {
    if (!(Object.keys(req.body).length)) {
      return res.status(400).send({
        error: 'request body does not contain any data',
      });
    }
    let recipe;
    try {
      recipe = RecipeModel.findById(req.params.recipeId);
      // disallow modification if recipe was not added by current user
      if (recipe.creatorId !== req.user.id) {
        return res.status(403).send({
          error: 'this recipe was added by another user',
        });
      }
      recipe = await recipe.update({ ...req.body, creatorId: recipe.creatorId });
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      message: 'recipe updated successfully',
      data: recipe,
    });
  }

  /**
   * Removes a recipe from the database
   */
  deleteRecipe = async (req, res) => {
    let recipe;
    try {
      recipe = RecipeModel.findById(req.params.recipeId);
      // disallow deletion if recipe was not added by current user
      if (recipe.creatorId !== req.user.id) {
        return res.status(403).send({
          error: 'this recipe was added by another user',
        });
      }
      await recipe.destroy();
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      message: `recipe with ${req.params.recipeId} has been successfully deleted`,
    });
  }

  postRecipeReview = async (req, res) => {
    const recipe = await RecipeModel.findById(req.params.recipeId, {
      attributes: ['creatorId'],
    });
    // disallow recipe creator from adding a review
    if (recipe.creatorId === req.user.id) {
      return res.status(400).send({
        error: 'you cannot review a recipe you created',
      });
    }
    let review;
    try {
      review = await ReviewModel.create({
        userId: req.user.id, recipeId: req.params.recipeId, ...req.body,
      });
    } catch (error) {
      res.status(400).send({
        message: 'specified recipeId or userId does not exist',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(201).json({
      message: 'review added successfully',
      data: review,
    });
  }

  getRecipeReviews = async (req, res) => {
    let reviews;
    let recipe;
    try {
      recipe = await RecipeModel.findById(req.params.recipeId);
      reviews = await recipe.getReviews({
        include: [{
          model: models.user,
          attributes: ['id', 'username', 'firstName', 'lastName'],
        }, {
          model: models.recipe,
          attributes: ['title'],
        }],
      });
    } catch (error) {
      return res.status(500).send({
        message: 'an error occurred',
        error: error.message || error.errors[0].message,
      });
    }
    return reviews.length > 0 ?
      res.status(200).json({
        data: reviews,
      }) :
      res.status(200).send({
        message: 'this recipe currently has no reviews',
      });
  }

  validateRequestData = (req, res, next) => {
    const results = validationResult(req);
    return results.isEmpty() ?
      next() :
      res.status(422).json({
        message: 'one or more of the required request data is not included or is invalid',
        errors: results.array(),
      });
  }
}

