import uuid from 'uuid';
import Recipe from '../models/recipe';

class RecipeService {
  constructor() {
    this.recipes = [];
  }

  getRecipes() {
    return this.recipes;
  }

  addRecipe(recipeData) {
    const recipewithTitleExists = this.recipes
      .filter(recipe => recipe.title === recipeData.title).length > 0;
    if (recipewithTitleExists) {
      return false;
    }
    const recipe = new Recipe(recipeData);
    recipe.id = uuid.v4();

    this.recipes.push(recipe);
    return recipe.id;
  }

  getRecipe(id) {
    const result = this.recipes.filter(recipe => recipe.id === id)[0];
    return result;
  }

  modifyRecipe(id) {
    
  }

  deleteRecipe(id) {

  }
}

export default new RecipeService();
