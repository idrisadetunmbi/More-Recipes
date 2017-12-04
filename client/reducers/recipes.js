import * as RecipeActions from '../actions/recipes';

const recipes = (state = {
  isFetching: false,
  error: null,
  recipes: [],
}, action) => {
  switch (action.type) {
    case RecipeActions.REQUEST_RECIPES:
      return {
        ...state,
        isFetching: true,
      };
    case RecipeActions.RECEIVE_RECIPES:
      return {
        isFetching: false,
        error: null,
        recipes: action.recipes,
      };
    case RecipeActions.ERROR_RECIPES_REQUEST:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default recipes;
