import express from 'express';

import userRouter from './user_routes';
import recipeRouter from './recipe_routes';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'More-Recipes API service',
  });
});

router.use('/users', userRouter);
router.use('/recipes', recipeRouter);

export default router;
