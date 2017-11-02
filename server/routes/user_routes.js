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

router.get(
  '/:userId/recipes', authenticateUser, userController.userGetRecipesValidationChecks,
  userController.validateRequestData, userController.getUserFavoriteRecipes,
);


export default router;
