import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

export default (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({
      error: 'you are not signed in or invalid token',
    });
  }
  token = req.headers.authorization.slice(7);
  let decodedPayload;
  try {
    decodedPayload = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  } catch (error) {
    return res.status(401).send({
      error: 'you are not signed in or invalid token',
    });
  }
  req.user = decodedPayload;
  return next();
};
