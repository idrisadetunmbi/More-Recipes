import express from 'express';
import UserController from '../controllers/user_controller';
import authenticateUser from '../middlewares/authentication';

const router = express.Router();
const userController = new UserController();

router.get('/', userController.getAllUsers);

router.post(
  '/signup', userController.userSignUpValidationChecks,
  userController.validateRequestData, userController.createUser,
);

router.post(
  '/signin', userController.userSignUpValidationChecks.slice(0, 2),
  userController.validateRequestData, userController.signInUser,
);

// update user profile - image only
router.put(
  '/', authenticateUser, userController.userImageUrlUpdateCheck,
  userController.validateRequestData, userController.updateUserImageUrl,
);

router.get(
  '/:userId/recipes', userController.userGetRecipesValidationChecks,
  userController.validateRequestData, userController.getUserRecipes,
);

router.get(
  '/:userId/recipes/favorites', userController.userGetRecipesValidationChecks,
  userController.validateRequestData, userController.getUserFavorites,
);


export default router;
