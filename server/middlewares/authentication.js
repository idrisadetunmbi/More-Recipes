import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';

dotenv.config({ path: `${__dirname}/../../.env` });

const UserModel = models.user;

export default async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({
      error: 'authentication is required for this action, please include user token',
    });
  }
  token = req.headers.authorization.slice(7);
  let decodedPayload;
  try {
    decodedPayload = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  } catch (error) {
    return res.status(401).send({
      error: 'invalid or expired token',
    });
  }
  const user = await UserModel.findById(decodedPayload.id);
  if (!user) {
    return res.status(404).send({
      message: 'user does not exist, please sign up a new account',
    });
  }
  req.user = decodedPayload;
  return next();
};
