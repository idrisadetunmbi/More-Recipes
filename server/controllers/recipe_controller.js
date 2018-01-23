import validate, { validationResult } from 'express-validator/check';
import models from '../models';

const RecipeModel = models.recipe;
const VoteModel = models.vote;

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
    validate.body('content', 'you must add a review with at least 5 characters').optional().isLength({ min: 5 }),
    validate.body('rating', 'recipe can only be rated between 1 to 5').isInt({ min: 1, max: 5 }).trim(),
  ];

  voteRecipeValidationCheck = [
    validate.query('action', 'please specify an action (one of "upvote", "downvote" or "favorite") for this method')
      .isIn(['upvote', 'favorite', 'downvote']).trim(),
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
        authorId: req.user.id,
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
      data: recipe,
    });
  }

  getAllRecipes = async (req, res) => {
    let recipes;
    try {
      recipes = await RecipeModel.findAll({
        include: [
          {
            model: models.user, as: 'author', attributes: ['username', 'imageUrl'],
          },
        ],
        order: req.query.sort === 'upvotes' ? ['upvotes'] : '',
      });
    } catch (error) {
      return res.status(500).send({
        message: 'unhandled server error',
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
        include: [
          {
            model: models.user, as: 'author', attributes: ['username', 'imageUrl'],
          },
        ],
      });
    } catch (error) {
      return res.status(500).send({
        message: 'unhandled server error',
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
      if (recipe.authorId !== req.user.id) {
        return res.status(403).send({
          error: 'this recipe was added by another user',
        });
      }
      recipe = await recipe.update({
        ...req.body,
        authorId: recipe.authorId,
        upvotes: recipe.upvotes,
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
      recipe = await RecipeModel.findById(req.params.recipeId);
      // disallow deletion if recipe was not added by current user
      if (recipe.authorId !== req.user.id) {
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
    const recipe = await RecipeModel.findById(req.params.recipeId);
    const { user } = req;

    user.review = req.body;
    await recipe.addUserReview(user);
    return res.status(201).json({
      message: 'review added successfully',
      data: {
        ...req.body,
        content: req.body.content || null,
        userId: user.id,
        recipeId: recipe.id,
      },
    });
  }

  getRecipeReviews = async (req, res) => {
    let recipe;
    try {
      recipe = await RecipeModel.findById(req.params.recipeId, {
        attributes: [],
        include: [{
          model: models.user,
          as: 'userReviews',
          attributes: ['username'],
          through: {
            attributes: ['content', 'rating', 'createdAt'],
          },
        }],
      });
    } catch (error) {
      return res.status(500).send({
        message: 'an error occurred',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      message: `reviews for recipe with id ${req.params.recipeId}`,
      data: recipe.userReviews,
    });
    // return recipe.userReviews.length > 0 ?
    //   res.status(200).json({
    //     message: `reviews for recipe with id ${recipe.id}`,
    //     data: recipe,
    //   }) :
    //   res.status(200).json({
    //     message: 'this recipe currently has no reviews',
    //   });
  }

  voteRecipe = async (req, res) => {
    const { user } = req;
    const recipe = await RecipeModel.findById(req.params.recipeId);
    if (user.id === recipe.authorId) {
      return res.status(403).send({
        error: 'you cannot favorite or upvote a recipe you created',
      });
    }

    let recipeIsUsersFavorite;
    switch (req.query.action) {
      case 'favorite':
        recipeIsUsersFavorite = await user.hasFavoriteRecipe(recipe);
        if (recipeIsUsersFavorite) {
          await user.removeFavoriteRecipe(recipe);
          recipe.update({
            favorites: recipe.favorites - 1,
          });
          return res.status(200).send({
            message: 'recipe has been removed as favorite',
          });
        }
        await user.addFavoriteRecipe(recipe);
        recipe.update({
          favorites: recipe.favorites + 1,
        });
        return res.status(200).send({
          message: 'recipe has been added as favorite',
        });
      case 'upvote': {
        const userHasVotedRecipe = await user
          .hasVotedRecipe(recipe);
        if (!userHasVotedRecipe) {
          VoteModel.create({
            userId: user.id,
            recipeId: recipe.id,
            type: 'upvote',
          });
          recipe.increment('upvotes');
          return res.status(200).send({
            message: 'recipe has been upvoted successfully',
          });
        }
        const voteRecord = await VoteModel.findOne({
          where: {
            recipeId: recipe.id,
            userId: user.id,
          },
        });
        if (voteRecord.type === 'upvote') {
          await user.removeVotedRecipe(recipe);
          recipe.decrement('upvotes');
          return res.status(200).send({
            message: 'upvote has been removed on recipe',
          });
        }
        if (voteRecord.type === 'downvote') {
          await voteRecord.update({
            type: 'upvote',
          });
          recipe.increment('upvotes');
          recipe.decrement('downvotes');
          return res.status(200).send({
            message: 'recipe has been upvoted successfully',
          });
        }
      }
        break;
      case 'downvote': {
        const userHasVotedRecipe = await user
          .hasVotedRecipe(recipe);
        if (!userHasVotedRecipe) {
          VoteModel.create({
            userId: user.id,
            recipeId: recipe.id,
            type: 'downvote',
          });
          recipe.increment('downvotes');
          return res.status(200).send({
            message: 'recipe has been downvoted successfully',
          });
        }
        const voteRecord = await VoteModel.findOne({
          where: {
            recipeId: recipe.id,
            userId: user.id,
          },
        });
        if (voteRecord.type === 'downvote') {
          await user.removeVotedRecipe(recipe);
          recipe.decrement('downvotes');
          return res.status(200).send({
            message: 'downvote has been removed on recipe',
          });
        }
        if (voteRecord.type === 'upvote') {
          await voteRecord.update({
            type: 'downvote',
          });
          recipe.decrement('upvotes');
          recipe.increment('downvotes');
          return res.status(200).send({
            message: 'recipe has been downvoted successfully',
          });
        }
      }
        break;
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

