import * as RecipeActions from '../actions/recipes';

const removeDuplicates = (recipes) => {
  const pushedRecipeIds = [];
  const pushedRecipes = [];
  recipes.forEach((recipe) => {
    if (!pushedRecipeIds.includes(recipe.id)) {
      pushedRecipeIds.push(recipe.id);
      pushedRecipes.push(recipe);
    }
  });
  return pushedRecipes;
};

const sortRecipes = (recipes, recipe) => {
  const allRecipes = [...recipes, recipe];
  allRecipes.sort((a, b) => a.upvotes < b.upvotes);
  return removeDuplicates(allRecipes);
};

const updateRecipes = (recipes = [], { requestType, data }) => {
  switch (requestType) {
    case RecipeActions.FETCH_RECIPES:
      return [...recipes, ...data];
    case RecipeActions.FETCH_RECIPE:
      return sortRecipes(recipes, data);
    case RecipeActions.CREATE_RECIPE:
      return [data, ...recipes];
    case RecipeActions.DELETE_RECIPE: {
      // in case delete, only recipe id is passed for deletion
      const recipeId = data;
      return recipes.filter(element => element.id !== recipeId);
    }
    case RecipeActions.UPDATE_RECIPE:
      return recipes.map((recipe) => {
        if (recipe.id === data.id) {
          return data;
        }
        return recipe;
      });
    default:
      return recipes;
  }
};

const recipes = (state = {
  requestInitiated: false,
  requestError: null,
  recipes: [],
  fetchedAll: false,
}, action) => {
  switch (action.type) {
    case RecipeActions.INITIATE_RECIPE_ACTION_REQUEST:
      return {
        ...state,
        requestInitiated: true,
        requestError: null,
      };
    case RecipeActions.ERROR_RECIPE_ACTION_REQUEST:
      return {
        ...state,
        requestInitiated: false,
        requestError: action.error,
      };
    case RecipeActions.RECEIVE_RECIPE_ACTION_RESPONSE:
      return {
        ...state,
        requestInitiated: false,
        requestError: null,
        recipes: updateRecipes(state.recipes, action),
      };
    case RecipeActions.FETCHED_ALL_RECIPES:
      return {
        ...state,
        fetchedAll: true,
      };
    default:
      return state;
  }
};

export default recipes;
