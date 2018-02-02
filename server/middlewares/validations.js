import validate, { validationResult } from 'express-validator/check';
import models from '../models';

export default (req, res, next) => {
  const results = validationResult(req);
  return results.isEmpty() ?
    next() :
    res.status(400).json({
      message: 'one or more of the required request data is not included or is invalid',
      errors: results.array(),
    });
};


export const recipeRequestsValidations = {
  createRecipe: [
    validate.body('title', 'title must be between 5 to 50 characters')
      .isLength({ min: 5, max: 50 }).not().isInt()
      .trim(),
    validate.body('description', 'you must add a description with at least 5 characters').isLength({ min: 5 }).trim().escape(),
    validate.body('ingredients', 'ingredients must be included with at least 5 characters').isLength({ min: 5 }).trim().escape(),
    validate.body('directions', 'directions are required for a recipe with at least 5 characters').isLength({ min: 5 }).trim().escape(),
  ],

  getRecipe: [
    validate.param('recipeId', 'recipe id is invalid or stated recipe does not exist').isUUID()
      .custom(value => models.recipe.findById(value)),
  ],

  modifyRecipe: [
    validate.body('title', 'title must be between 5 to 50 characters')
      .isLength({ min: 5, max: 50 }).not().isInt()
      .optional()
      .trim()
      .escape(),
    validate.body('description', 'you must add a description').isLength({ min: 5 }).optional().trim()
      .escape(),
    validate.body('ingredients', 'ingredients must be included').isLength({ min: 5 }).optional().trim()
      .escape(),
    validate.body('directions', 'directions are required for a recipe').isLength({ min: 5 }).optional().trim()
      .escape(),
  ],

  postReview: [
    validate.body('content').isLength({ min: 1 }).trim().escape(),
    validate.body('rating', 'recipe can only be rated between 1 to 5').isInt({ min: 1, max: 5 }).trim(),
  ],

  voteRecipe: [
    validate.param('voteType', 'invalid vote type, specify either ')
      .isIn(['upvote', 'downvote']).trim(),
  ],
};

export const userRequestsValidations = {
  userSignUp: [
    validate.body('username', 'username must be between 5 to 15 alphanumeric characters')
      .isLength({ min: 5, max: 15 }).isAlphanumeric().trim(),
    validate.body('password', 'include a password between 6 to 25 characters').isLength({ min: 5, max: 25 }).trim(),
    validate.body('email', 'invalid email').isEmail().normalizeEmail(),
  ],

  getUserRecipes: [
    validate.param('userId', 'user id is invalid or specified user does not exist').isUUID()
      .custom(value => models.user.findById(value)),
  ],

  updateUserImageUrl: [
    validate.body('imageUrl', 'please specify an image url in request body').isURL(),
  ],

};
