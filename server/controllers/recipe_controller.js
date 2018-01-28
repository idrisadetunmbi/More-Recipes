import validate, { validationResult } from 'express-validator/check';
import models from '../models';

const RecipeModel = models.recipe;
const VoteModel = models.vote;

/**
 *
 *
 * @export
 * @class RecipeController
 */
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

  getRecipeFromDb = recipeId =>
    RecipeModel.findById(recipeId, {
      include: [
        {
          model: models.user, as: 'author', attributes: ['username', 'imageUrl'],
        },
      ],
    });

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
      recipe = await this.getRecipeFromDb(recipe.id);
    } catch (error) {
      return res.status(400).send({
        message: 'An error occured while performing this request',
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
      recipe = await this.getRecipeFromDb(req.params.recipeId);
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
      recipe = await this.getRecipeFromDb(req.params.recipeId);
      // disallow modification if recipe was not added by current user
      if (recipe.authorId !== req.user.id) {
        return res.status(403).send({
          error: 'this recipe was added by another user',
        });
      }
      await recipe.update({
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
  }

  voteRecipe = async (req, res) => {
    const { user } = req;
    const recipe = await this.getRecipeFromDb(req.params.recipeId);
    if (user.id === recipe.authorId) {
      return res.status(403).send({
        error: `you cannot ${req.query.action} a recipe you created`,
      });
    }

    if (req.query.action === 'favorite') {
      const recipeIsUsersFavorite = await user.hasFavoriteRecipe(recipe);
      if (recipeIsUsersFavorite) {
        user.removeFavoriteRecipe(recipe);
        await recipe.decrement('favorites');
        return res.status(200).send({
          message: 'recipe has been removed as favorite',
          data: recipe,
        });
      }
      user.addFavoriteRecipe(recipe);
      await recipe.increment('favorites');
      return res.status(200).send({
        message: 'recipe has been added as favorite',
        data: recipe,
      });
    }
    // action is either upvote or downvote
    const { action } = req.query;
    const vote = await recipe.getVoters({
      attributes: [],
      where: { id: user.id },
      joinTableAttributes: ['type'],
    });

    const currentVoteType = vote.length && vote[0].vote.type;
    if (!currentVoteType || currentVoteType !== action) {
      recipe.addVoter(user, { through: { type: action } });
      await recipe.increment(`${action}s`);
      if (currentVoteType && currentVoteType !== action) {
        await recipe.decrement(`${currentVoteType}s`);
      }
      return res.status(200).send({
        message: `recipe has been ${action}d`,
        recipe,
      });
    }
    recipe.removeVoter(user);
    await recipe.decrement(`${action}s`);
    return res.status(200).send({
      message: `${action} has been removed on recipe`,
      recipe,
    });
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

