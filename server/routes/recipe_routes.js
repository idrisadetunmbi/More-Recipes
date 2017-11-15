import express from 'express';
import RecipeController from '../controllers/recipe_controller';
import authenticateUser from '../middlewares/authentication';

const router = express.Router();
const controller = new RecipeController();

router.use(authenticateUser);

router.get('/', controller.getAllRecipes);

router.get(
  '/:recipeId', controller.recipeGetValidationChecks,
  controller.validateRequestData, controller.getRecipe,
);

router.post(
  '/', controller.recipePostValidationChecks,
  controller.validateRequestData, controller.createRecipe,
);

router.put(
  '/:recipeId', [...controller.recipeGetValidationChecks, ...controller.recipePutValidationChecks],
  controller.validateRequestData, controller.modifyRecipe,
);

router.delete(
  '/:recipeId', controller.recipeGetValidationChecks,
  controller.validateRequestData, controller.deleteRecipe,
);

router.post(
  '/:recipeId', [...controller.recipeGetValidationChecks, ...controller.voteRecipeValidationCheck],
  controller.validateRequestData, controller.voteRecipe,
);

router.post(
  '/:recipeId/reviews', [...controller.recipeGetValidationChecks, ...controller.reviewPostValidationChecks],
  controller.validateRequestData, controller.postRecipeReview,
);

router.get(
  '/:recipeId/reviews', controller.recipeGetValidationChecks,
  controller.validateRequestData, controller.getRecipeReviews,
);

export default router;
