import express from 'express';
import RecipeController from '../controllers/recipe';

const router = express.Router();
const controller = new RecipeController();

router.get('/', controller.getRecipes);
router.get('/:id', controller.recipeGetValidationChecks, controller.validateRequestData, controller.getRecipe);
router.post('/', controller.recipePostValidationChecks, controller.validateRequestData, controller.postRecipe);
router.put('/:id', [...controller.recipeGetValidationChecks, ...controller.recipePutValidationChecks], controller.validateRequestData, controller.putRecipe);
router.delete('/:id', controller.recipeGetValidationChecks, controller.validateRequestData, controller.deleteRecipe);
router.post('/:recipeId/reviews', controller.reviewPostValidationChecks, controller.validateRequestData, controller.postRecipeReview);
router.get('/:recipeId/reviews', [controller.reviewPostValidationChecks[1]], controller.validateRequestData, controller.getRecipeReviews);

export default router;
