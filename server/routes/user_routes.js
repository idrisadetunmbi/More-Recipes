import express from 'express';
import UserController from '../controllers/user_controller';

const router = express.Router();
const userController = new UserController();

router.post(
  '/signup', userController.userSignUpValidationChecks,
  userController.validateRequestData, userController.createUser,
);

router.post(
  '/signin', userController.userSignUpValidationChecks.slice(0, 2),
  userController.validateRequestData, userController.signInUser,
);


export default router;
