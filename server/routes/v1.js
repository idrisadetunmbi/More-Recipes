import express from 'express';

import userRouter from './users';
import recipeRouter from './recipes';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'More-Recipes API service',
  });
});

router.use('/users', userRouter);
router.use('/recipes', recipeRouter);

export default router;
