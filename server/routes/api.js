import express from 'express';
import recipeRouter from './recipe_routes';
import userRouter from './user_routes';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'More-Recipes API service',
  });
});

router.use('/users', userRouter);
router.use('/recipes', recipeRouter);

export default router;
