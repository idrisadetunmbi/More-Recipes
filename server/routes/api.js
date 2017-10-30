import express from 'express';
import recipeRouter from './recipe_routes';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'More-Recipes API service',
  });
});


router.use('/recipes', recipeRouter);

export default router;
