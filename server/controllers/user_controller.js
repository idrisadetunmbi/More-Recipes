import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validate, { validationResult } from 'express-validator/check';

import models from '../models/sequelize_models';

dotenv.config({ path: `${__dirname}/../../.env` });
const UserModel = models.user;

export default class UserController {
  /**
   * Array storing validations for a POST recipe request
   */
  userSignUpValidationChecks = [
    validate.body('username', 'username must be between 5 to 15 alphanumeric characters')
      .isLength({ min: 5, max: 15 }).isAlphanumeric().trim(),
    validate.body('password', 'include a password between 6 to 25 characters').isLength({ min: 5, max: 25 }).trim(),
    validate.body('email', 'invalid email').isEmail().normalizeEmail(),
    validate.body('firstName', 'include a first name containing only letters').isAlpha().trim(),
    validate.body('lastName', 'include a last name containing only letters').isAlpha().trim(),
  ];

  createUser = async (req, res) => {
    let user;
    try {
      user = await UserModel.create(req.body);
    } catch (error) {
      return res.status(400).send({
        message: 'an error occured while trying to complete the request',
        error: error.errors[0].message || error.message,
      });
    }
    // user.password = undefined;
    const { password, ...userDetails } = user.get();
    const token = jwt.sign(
      userDetails,
      process.env.JWT_AUTH_SECRET,
      { expiresIn: '7d' },
    );
    return res.status(201).send({
      message: 'user signup is successful',
      data: { ...userDetails, token },
    });
  }

  signInUser = async (req, res) => {
    let user;
    try {
      user = await UserModel.findOne({ where: { username: req.body.username } });
    } catch (error) {
      return res.status(400).send({
        message: 'an error occured while trying to complete the request',
        error: error.errors[0].message || error.message,
      });
    }
    if (!user) {
      return res.status(400).send({
        error: 'username does not exist',
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) { // if password is not correct
      return res.status(401).send({
        error: 'you have entered a wrong password',
      });
    }
    const { password, ...userDetails } = user.get();
    const token = jwt.sign(
      userDetails,
      process.env.JWT_AUTH_SECRET,
      { expiresIn: '7d' },
    );
    return res.status(200).send({
      message: 'you have successfully signed in',
      data: { ...userDetails, token },
    });
  }

  validateRequestData = (req, res, next) => {
    const results = validationResult(req);
    return results.isEmpty() ?
      next() :
      res.status(422).json({
        message: 'one or more of the required request data is not included or is invalid',
        errors: results.array(),
      });
  }
}
