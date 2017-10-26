import express from 'express';

import RecipeController from '../controllers/recipe';

const router = express.Router();
const recipeRouter = express.Router();

const Recipe = new RecipeController(recipeRouter);
router.use('/recipes', recipeRouter);

export default router;
