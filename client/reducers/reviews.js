import { RECEIVE_REVIEWS, ERROR_REVIEWS, ADD_RECIPE_REVIEW } from '../actions/reviews';

const reviews = (state = { error: null }, action) => {
  switch (action.type) {
    case ERROR_REVIEWS:
      return {
        ...state,
        error: action.error,
      };
    case RECEIVE_REVIEWS:
      return {
        error: null,
        ...state,
        [action.recipeId]: action.data,
      };
    case ADD_RECIPE_REVIEW:
      return {
        ...state,
        [action.recipeId]: [action.data, ...state[action.recipeId]],
      };
    default:
      return state;
  }
};

export default reviews;
