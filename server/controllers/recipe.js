import validate, { validationResult } from 'express-validator/check';
import RecipesService from '../services/RecipesService';
import ReviewService from '../services/ReviewService';

export default class RecipeController {
  /**
   * Array storing validations for a POST recipe request
   */
  recipePostValidationChecks = [
    validate.body('title', 'title must be between 5 to 50 characters')
      .isLength({ min: 5, max: 50 }).not().isInt()
      .trim(),
    validate.body('description', 'you must add a description').exists(),
    validate.body('ingredients', 'ingredients must be included').exists(),
    validate.body('directions', 'directions are required for a recipe').exists(),
  ];

  /**
   * Stores validation for a GET request
   */
  recipeGetValidationChecks = [
    validate.param('id', 'recipe id is invalid').isUUID(),
  ];

  recipePutValidationChecks = [
    validate.body('title', 'title must be between 5 to 50 characters')
      .isLength({ min: 5, max: 50 }).not().isInt()
      .optional()
      .trim(),
  ];

  reviewPostValidationChecks = [
    validate.body('review', 'you must add a review with at least 5 characters').isLength({ min: 5 }),
    validate.param('recipeId', 'invalid recipe id or recipe does not exist').isUUID()
      .custom((value, { req }) => RecipesService.getRecipe(value)),
  ];

  getRecipes = (req, res) => {
    const recipes = RecipesService.getRecipes();
    if (req.query.sort) {
      recipes.sort((upvotesA, upvotesB) => upvotesB - upvotesA);
    }
    res.status(200).send({
      data: recipes,
    });
  }

  getRecipe = (req, res) => {
    const recipe = RecipesService.getRecipe(req.params.id);
    return recipe ?
      res.status(200).send({
        data: recipe,
      }) :
      res.status(404).send({
        error: `recipe with id - ${req.params.id} does not exist`,
      });
  }

  /**
   * Adds a new recipe
   * @param()
   */
  postRecipe = (req, res) => {
    const recipe = RecipesService.addRecipe(req.body);
    return res.status(201).send({
      message: 'Recipe created successfully',
      data: { ...req.body, id: recipe },
    });
  }

  putRecipe = (req, res) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        error: 'request body does not contain any data',
      });
    }
    const response = RecipesService.modifyRecipe(req.params.id, req.body);
    return response ?
      res.status(200).send({
        message: `recipe with id - ${req.params.id} has been successfully deleted`,
      }) :
      res.status(404).send({
        error: 'recipe with the specified id does not exist',
      });
  }

  deleteRecipe = (req, res) => {
    const result = RecipesService.deleteRecipe(req.params.id);
    return result ?
      res.status(200).send({
        message: `recipe with id - ${req.params.id} has been successfully deleted`,
      }) :
      res.status(404).send({
        error: `recipe with id - ${req.params.id} does not exist`,
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

