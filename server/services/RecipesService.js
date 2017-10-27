import Recipe from '../models/recipe';

class RecipeService {
  constructor() {
    this.recipes = [];
  }

  getRecipes() {
    return this.recipes;
  }

  addRecipe(reqBody) {
    const recipe = new Recipe(reqBody);
    this.recipes.push(recipe);
    return recipe.id;
  }

  getRecipe(id) {
    const result = this.recipes.filter(recipe => recipe.id === id);
    return result.length > 0 ? result[0] : false;
  }

  modifyRecipe(id, recipeData) {
    const recipe = this.recipes.filter(rec => rec.id === id)[0];
    if (!recipe) {
      return false;
    }
    recipe.title = recipeData.title || recipe.title;
    recipe.description = recipeData.description || recipe.description;
    recipe.ingredients = recipeData.ingredients || recipe.ingredients;
    recipe.directions = recipeData.directions || recipe.directions;
    recipe.category = recipeData.category || recipe.category;
    return true;
  }

  deleteRecipe(id) {
    const recipewithIDExists = this.recipes
      .filter(recipe => recipe.id === id).length > 0;
    if (!recipewithIDExists) {
      return false;
    }
    this.recipes = this.recipes.filter(recipe => recipe.id !== id);
    return true;
  }
}

export default new RecipeService();
