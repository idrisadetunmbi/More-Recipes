import { check, validationResult } from 'express-validator/check';
import RecipesService from '../services/RecipesService';

export default class RecipeController {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  postRecipeValidationArray = [
    check('title', 'title must be between 5 to 50 characters').isLength({ min: 5, max: 50 }).trim(),
    check('description', 'you must add a description').exists(),
    check('ingredients', 'ingredients must be included').exists(),
    check('directions', 'directions are required for a recipe').exists(),
  ];

  getRecipeValidationArray = [
    check('id', 'recipe id is not included or is invalid').isUUID(),
  ];

  registerRoutes() {
    this.router.get('/:id', this.getRecipeValidationArray, this.getRecipe);
    this.router.get('/', this.getRecipes);
    this.router.post('/', this.postRecipeValidationArray, this.validatePostRecipeData, this.postRecipe);
    this.router.put('/:id', this.validatePutRecipeData, this.putRecipe);
    this.router.delete('/:id', this.deleteRecipe);
  }

  getRecipe = (req, res) => {
    try {
      validationResult(req).throw();
    } catch (error) {
      return res.status(422).json({
        error: error.array()[0],
      });
    }
    const recipe = RecipesService.getRecipe(req.params.id);
    return res.status(200).send({
      data: recipe,
    });
  }

  getRecipes = (req, res) => {
    const recipes = RecipesService.getRecipes();
    res.status(200).send({
      data: recipes,
    });
  }

  /**
   * Adds a new recipe
   * @param(req)
   */
  postRecipe = (req, res) => {
    const recipe = RecipesService.addRecipe(req.body);
    if (!recipe) {
      res.status(400).send({
        message: 'Recipe with title already exists, please choose another title',
      });
      return;
    }
    res.status(201).send({
      message: 'Recipe created successfully',
      data: { ...req.body, id: recipe },
    });
  }

  validatePostRecipeData = (req, res, next) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      return res.status(422).json({
        message: 'one or more of the required request data is not included or is invalid',
        errors: results.array(),
      });
    }
    return next();
  }

  validatePutRecipeData = (req, res, next) => {

  }

  putRecipe = (req, res) => {

  }

  deleteRecipe = (req, res) => {

  }
}
