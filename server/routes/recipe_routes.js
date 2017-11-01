import express from 'express';
import RecipeController from '../controllers/recipe_controller';

const router = express.Router();
const controller = new RecipeController();

router.get('/', controller.getRecipes);
router.get('/:recipeId', controller.recipeGetValidationChecks, controller.validateRequestData, controller.getRecipe);
router.post('/', controller.recipePostValidationChecks, controller.validateRequestData, controller.postRecipe);
router.put('/:recipeId', [...controller.recipeGetValidationChecks, ...controller.recipePutValidationChecks], controller.validateRequestData, controller.putRecipe);
router.delete('/:recipeId', controller.recipeGetValidationChecks, controller.validateRequestData, controller.deleteRecipe);
router.post('/:recipeId/reviews', controller.reviewPostValidationChecks, controller.validateRequestData, controller.postRecipeReview);
router.get('/:recipeId/reviews', [controller.reviewPostValidationChecks[1]], controller.validateRequestData, controller.getRecipeReviews);

export default router;
