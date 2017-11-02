import express from 'express';
import RecipeController from '../controllers/recipe_controller';
import authenticateUser from '../middlewares/authentication';

const router = express.Router();
const controller = new RecipeController();

router.get('/', authenticateUser, controller.getAllRecipes);

router.get(
  '/:recipeId', authenticateUser, controller.recipeGetValidationChecks,
  controller.validateRequestData, controller.getRecipe,
);

router.post(
  '/', authenticateUser, controller.recipePostValidationChecks,
  controller.validateRequestData, controller.createRecipe,
);

router.put(
  '/:recipeId', authenticateUser, [...controller.recipeGetValidationChecks, ...controller.recipePutValidationChecks],
  controller.validateRequestData, controller.modifyRecipe,
);

router.delete(
  '/:recipeId', authenticateUser, controller.recipeGetValidationChecks,
  controller.validateRequestData, controller.deleteRecipe,
);

router.post(
  '/:recipeId', authenticateUser, [...controller.recipeGetValidationChecks, ...controller.voteRecipeValidationCheck],
  controller.validateRequestData, controller.voteRecipe,
);

router.post(
  '/:recipeId/reviews', authenticateUser, controller.reviewPostValidationChecks,
  controller.validateRequestData, controller.postRecipeReview,
);

router.get(
  '/:recipeId/reviews', authenticateUser, controller.recipeGetValidationChecks,
  controller.validateRequestData, controller.getRecipeReviews,
);

export default router;
