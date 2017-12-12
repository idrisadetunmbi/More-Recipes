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

const recipes = (state = {
  isFetching: false,
  error: null,
  recipes: [],
  recipeAction: {
    // type: null, // create, edit/update or delete
    // error: null,
    // initiated: false,
  },
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
      switch (state.recipeAction.type) {
        case 'create':
          return {
            ...state,
            recipes: [action.response, ...state.recipes],
            recipeAction: {
              initiated: false,
              error: null,
            },
          };
        case 'delete':
          return {
            ...state,
            recipes: state.recipes.filter(recipe => recipe.id !== action.response),
            recipeAction: {
              initiated: false,
              error: null,
            },
          };
        default:
          break;
      }
      break;
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
