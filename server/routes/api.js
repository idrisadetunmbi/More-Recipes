import express from 'express';

import RecipeController from '../controllers/recipe';

const router = express.Router();
const recipeRouter = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'More-Recipes API service',
  });
});

const Recipe = new RecipeController(recipeRouter);
router.use('/recipes', recipeRouter);

export default router;
