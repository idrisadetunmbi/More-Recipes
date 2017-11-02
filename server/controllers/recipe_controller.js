import validate, { validationResult } from 'express-validator/check';

import models from '../models';

const RecipeModel = models.recipe;
const ReviewModel = models.review;
const RecipeActionModel = models.recipe_action;

export default class RecipeController {
  /**
   * Array storing validations for a POST recipe request
   */
  recipePostValidationChecks = [
    validate.body('title', 'title must be between 5 to 50 characters')
      .isLength({ min: 5, max: 50 }).not().isInt()
      .trim(),
    validate.body('description', 'you must add a description with at least 5 characters').isLength({ min: 5 }).trim().escape(),
    validate.body('ingredients', 'ingredients must be included with at least 5 characters').isLength({ min: 5 }).trim().escape(),
    validate.body('directions', 'directions are required for a recipe with at least 5 characters').isLength({ min: 5 }).trim().escape(),
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
    validate.body('stars', 'recipe can only be rated between 1 to 5').isInt({ min: 1, max: 5 }).optional().trim(),
  ];

  voteRecipeValidationCheck = [
    validate.query('action', 'please specify an action (upvote, downvote or favorite) for this method')
      .isIn(['upvote', 'downvote', 'favorite']).trim(),
  ];

  /**
   * Adds a new recipe
   * @param()
   */
  createRecipe = async (req, res) => {
    let recipe;
    try {
      recipe = await RecipeModel.create({
        ...req.body,
        creatorId: req.user.id,
        upvotes: 0,
        downvotes: 0,
        favorites: 0,
      });
    } catch (error) {
      return res.status(400).send({
        message: 'user does not exist',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(201).send({
      message: 'Recipe created successfully',
      data: {
        ...req.body,
        id: recipe.id,
        creator: req.user.username,
        upvotes: recipe.upvotes,
        downvotes: recipe.downvotes,
        favorites: recipe.favorites,
        createdAt: recipe.createdAt,
      },
    });
  }

  getAllRecipes = async (req, res) => {
    let recipes;
    try {
      recipes = await RecipeModel.findAll({
        include: [{ model: models.user, as: 'creator', attributes: ['username'] }],
        order: req.query.sort === 'upvotes' ? ['upvotes'] : '',
      });
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      messgae: 'recipe listing',
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
        message: 'server unhandled error',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      data: recipe,
    });
  }

  modifyRecipe = async (req, res) => {
    if (!(Object.keys(req.body).length)) {
      return res.status(400).send({
        error: 'request body does not contain any data to modify recipe',
      });
    }
    let recipe;
    try {
      recipe = await RecipeModel.findById(req.params.recipeId);
      // disallow modification if recipe was not added by current user
      if (recipe.creatorId !== req.user.id) {
        return res.status(403).send({
          error: 'this recipe was added by another user',
        });
      }
      recipe = await recipe.update({
        ...req.body,
        creatorId: recipe.creatorId,
        upvotes: recipe.upvotes,
        downvotes: recipe.downvotes,
        favorites: recipe.favorites,
      });
    } catch (error) {
      return res.status(500).send({
        message: 'server unhandled error',
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
        message: `reviews for recipe with id ${recipe.id}`,
        data: reviews,
      }) :
      res.status(200).send({
        message: 'this recipe currently has no reviews',
      });
  }

  voteRecipe = async (req, res) => {
    const recipe = await RecipeModel.findById(req.params.recipeId, {
      attributes: ['creatorId', 'upvotes', 'downvotes', 'favorites'],
    });
    // disallow recipe creator from voting a review
    if (recipe.creatorId === req.user.id) {
      return res.status(400).send({
        error: 'you cannot vote a recipe you created',
      });
    }

    const { action } = req.query;
    const userId = req.user.id;
    const { recipeId } = req.params;

    let record;
    try {
      record = await RecipeActionModel.findOne({
        where: {
          userId,
          recipeId,
        },
      });
    } catch (error) {
      return res.status(500).send({
        message: 'unhandled error',
        error: error.message || error.errors[0].message,
      });
    }

    switch (action) {
      case 'upvote':
        if (record) {
          if (record.vote === 'upvote') {
            return res.status(400).send({
              error: 'you had previously upvoted this recipe',
            });
          } else if (record.vote === 'downvote') {
            await recipe.update({
              upvotes: recipe.upvotes + 1,
              downvotes: recipe.downvotes - 1,
            });
          } else {
            await recipe.update({
              upvotes: recipe.upvotes + 1,
            });
          }
          await record.update({
            vote: 'upvote',
          });
          return res.status(200).send({
            message: 'you have successfully upvoted this recipe',
          });
        }
        // if record does not exist, create the record with vote as downvote
        await RecipeActionModel.create({
          userId,
          recipeId,
          vote: 'upvote',
        });
        await recipe.update({
          upvotes: recipe.upvotes + 1,
        });
        return res.status(200).send({
          message: 'you have successfully upvoted this recipe',
        });
      case 'downvote':
        if (record) {
          if (record.vote === 'downvote') {
            return res.status(400).send({
              error: 'you had previously downvoted this recipe',
            });
          } else if (record.vote === 'upvote') {
            await recipe.update({
              upvotes: recipe.upvotes - 1,
              downvotes: recipe.downvotes + 1,
            });
          } else {
            await recipe.update({
              downvotes: recipe.downvotes + 1,
            });
          }
          await record.update({
            vote: 'downvote',
          });
          return res.status(200).send({
            message: 'you have successfully downvoted this recipe',
          });
        }
        // if record does not exist, create the record with vote as downvote
        await RecipeActionModel.create({
          userId,
          recipeId,
          vote: 'downvote',
        });
        await recipe.update({
          downvotes: recipe.downvotes + 1,
        });
        return res.status(200).send({
          message: 'you have successfully downvoted this recipe',
        });
      case 'favorite':
        if (!record) {
          await RecipeActionModel.create({
            userId,
            recipeId,
            favorite: true,
          });
          await recipe.update({
            favorites: recipe.favorites + 1,
          });
          return res.status(201).send({
            message: 'you have successfully favoured this recipe',
          });
        }
        if (record.favorite) {
          return res.status(400).send({
            error: 'this recipe is already a favorite',
          });
        }
        await recipe.update({
          favorites: recipe.favorites + 1,
        });
        await record.update({
          favorite: true,
        });
        return res.status(200).send({
          message: 'you have successfully favoured this recipe',
        });
      default:
        break;
    }
  }

  validateRequestData = (req, res, next) => {
    const results = validationResult(req);
    return results.isEmpty() ?
      next() :
      res.status(400).json({
        message: 'one or more of the required request data is not included or is invalid',
        errors: results.array(),
      });
  }
}

