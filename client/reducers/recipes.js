import * as Recipes from '../actions/recipes';
import * as RecipeAction from '../actions/recipe';

const recipeAction = (state = {
  type: null, // create, edit/update or delete
  error: null,
  initiated: false,
}, action) => {
  switch (action.type) {
    case RecipeAction.INITIATE_RECIPE_ACTION_REQUEST:
      return {
        error: null,
        initiated: true,
        type: action.actionType,
      };
    case RecipeAction.ERROR_RECIPE_ACTION_REQUEST:
      return {
        ...state,
        initiated: false,
        error: action.error,
      };
    default:
      return state;
  }
};

const updateRecipes = (recipes, recipe, actionType) => {
  let updatedRecipes;
  switch (actionType) {
    case 'create':
      updatedRecipes = [recipe, ...recipes];
      break;
    case 'delete': {
      // in case delete, only recipe id is passed for deletion
      const recipeId = recipe;
      updatedRecipes = recipes.filter(element => element.id !== recipeId);
      break;
    }
    case 'update':
    case 'upvote':
    case 'downvote':
    case 'postReview':
    case 'favorite':
      updatedRecipes = recipes.map((recp) => {
        if (recp.id === recipe.id) {
          return recipe;
        }
        return recp;
      });
      break;
    default:
      updatedRecipes = recipes;
      break;
  }
  return updatedRecipes;
};

const recipes = (state = {
  isFetching: false,
  error: null,
  recipes: [],
  recipeAction: {},
}, action) => {
  switch (action.type) {
    case Recipes.REQUEST_RECIPES:
      return {
        ...state,
        isFetching: true,
      };
    case Recipes.RECEIVE_RECIPES:
      return {
        ...state,
        isFetching: false,
        error: null,
        recipes: action.recipes,
      };
    case Recipes.ERROR_RECIPES_REQUEST:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    case RecipeAction.RECEIVE_RECIPE_ACTION_RESPONSE:
      return {
        ...state,
        recipeAction: {
          initiated: false,
          error: null,
        },
        recipes: updateRecipes(state.recipes, action.recipe, state.recipeAction.type),
      };
    case RecipeAction.INITIATE_RECIPE_ACTION_REQUEST:
    case RecipeAction.ERROR_RECIPE_ACTION_REQUEST:
      return {
        ...state,
        recipeAction: recipeAction(state.recipeAction, action),
      };
    default:
      return state;
  }
};

export default recipes;
