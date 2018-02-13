import * as RecipeActions from '../actions/recipes';

const updateRecipes = (recipes = [], { requestType, data }) => {
  switch (requestType) {
    case RecipeActions.FETCH_RECIPES:
      return [...recipes, ...data];
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
        requestInitiated: false,
        requestError: null,
        recipes: updateRecipes(state.recipes, action),
      };
    default:
      return state;
  }
};

export default recipes;
