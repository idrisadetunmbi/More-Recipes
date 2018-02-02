import express from 'express';
import RecipeController from '../controllers/recipes';
import authenticateUser from '../middlewares/authentication';
import validator, { recipeRequestsValidations } from '../middlewares/validations';

const router = express.Router();
const controller = new RecipeController();

router.get('/', controller.getAllRecipes);

router.get(
  '/:recipeId',
  recipeRequestsValidations.getRecipe,
  validator,
  controller.getRecipe,
);

router.post(
  '/',
  authenticateUser,
  recipeRequestsValidations.createRecipe,
  validator,
  controller.createRecipe,
);

router.put(
  '/:recipeId',
  authenticateUser,
  [
    ...recipeRequestsValidations.getRecipe,
    ...recipeRequestsValidations.modifyRecipe,
  ],
  validator,
  controller.modifyRecipe,
);

router.delete(
  '/:recipeId',
  authenticateUser,
  recipeRequestsValidations.getRecipe,
  validator,
  controller.deleteRecipe,
);

router.post(
  '/:recipeId/upvote',
  authenticateUser,
  recipeRequestsValidations.getRecipe,
  validator,
  controller.voteRecipe,
);

router.post(
  '/:recipeId/downvote',
  authenticateUser,
  recipeRequestsValidations.getRecipe,
  validator,
  controller.voteRecipe,
);


router.post(
  '/:recipeId/favorite',
  authenticateUser,
  recipeRequestsValidations.getRecipe,
  validator,
  controller.favoriteRecipe,
);

router.post(
  '/:recipeId/reviews',
  authenticateUser,
  [
    ...recipeRequestsValidations.getRecipe,
    ...recipeRequestsValidations.postReview,
  ],
  validator,
  controller.postRecipeReview,
);

router.get(
  '/:recipeId/reviews',
  recipeRequestsValidations.getRecipe,
  validator,
  controller.getRecipeReviews,
);

export default router;
