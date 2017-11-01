import validate, { validationResult } from 'express-validator/check';
import ReviewService from '../services/ReviewService';
import RecipesService from '../services/RecipesService';

import models from '../models/sequelize_models';

const RecipeModel = models.recipe;

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
    validate.param('recipeId', 'recipe id is invalid').isUUID(),
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
    validate.param('recipeId', 'invalid recipe id or recipe does not exist').isUUID()
      .custom((value, { req }) => RecipesService.getRecipe(value)),
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
      console.log(error);
      return res.status(500).send({
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
      recipes = await RecipeModel.findAll();
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      data: recipes,
    });
  }

  getRecipeById = async (recipeId) => {
    try {
      return await RecipeModel.findById(recipeId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets a single recipe from the database
   */
  getRecipe = async (req, res) => {
    let recipe;
    try {
      recipe = await this.getRecipeById(req.params.recipeId);
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    return recipe ?
      res.status(200).send({
        data: recipe,
      }) :
      res.status(404).send({
        error: `recipe with id - ${req.params.recipeId} does not exist`,
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
      recipe = await this.getRecipeById(req.params.recipeId);
      if (!recipe) {
        return res.status(404).send({
          error: 'recipe with the specified id does not exist',
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
      recipe = await this.getRecipeById(req.params.recipeId);
      await recipe.destroy();
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    res.status(200).send({
      message: `recipe with ${req.params.recipeId} has been successfully deleted`,
    });
  }

  postRecipeReview = (req, res) => {
    return ReviewService.addReview({ ...req.body, recipeId: req.params.recipeId }) ?
      res.status(201).json({
        message: 'review added successfully',
      }) :
      res.status(422).json({
        error: 'request data with the same details already exist',
      });
  }

  getRecipeReviews = (req, res) => {
    const recipeReviews = ReviewService.getReviews(req.params.recipeId);
    return recipeReviews ?
      res.status(200).json({
        data: recipeReviews,
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

