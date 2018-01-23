import { RECEIVE_FETCH_REVIEWS, ERROR_FETCH_REVIEWS } from '../actions/reviews';

const reviews = (state = { error: null }, action) => {
  switch (action.type) {
    case ERROR_FETCH_REVIEWS:
      return {
        ...state,
        error: action.error,
      };
    case RECEIVE_FETCH_REVIEWS:
      return {
        error: null,
        ...state,
        [action.recipeId]: action.data,
      };
    default:
      return state;
  }
};

export default reviews;
