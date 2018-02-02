import express from 'express';
import UserController from '../controllers/users';
import authenticateUser from '../middlewares/authentication';
import validator, { userRequestsValidations, recipeRequestsValidations }
  from '../middlewares/validations';

const router = express.Router();
const userController = new UserController();

router.get('/', userController.getAllUsers);

router.post(
  '/signup',
  userRequestsValidations.userSignUp,
  validator,
  userController.createUser,
);

router.post(
  '/signin',
  userRequestsValidations.userSignUp.slice(0, 2),
  validator,
  userController.signInUser,
);

// update user profile - image only
router.put(
  '/',
  authenticateUser,
  userRequestsValidations.updateUserImageUrl,
  validator,
  userController.updateUserImageUrl,
);

router.get(
  '/:userId/recipes',
  userRequestsValidations.getUserRecipes,
  validator,
  userController.getUserRecipes,
);

router.get(
  '/:userId/recipes/favorites',
  userRequestsValidations.getUserRecipes,
  validator,
  userController.getUserFavorites,
);

router.get(
  '/:recipeId/vote-statuses',
  authenticateUser,
  recipeRequestsValidations.getRecipe,
  validator,
  userController.getRecipeVoteStatuses,
);


export default router;
