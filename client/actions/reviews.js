import axios from 'axios';

export const ERROR_FETCH_REVIEWS = 'ERROR_FETCH_REVIEWS';
const errorFetchReviews = error => ({
  type: ERROR_FETCH_REVIEWS,
  error,
});

export const RECEIVE_FETCH_REVIEWS = 'RECEIVE_FETCH_REVIEWS';
const receiveFetchReviews = (data, recipeId) => ({
  type: RECEIVE_FETCH_REVIEWS,
  recipeId,
  data,
});

export const fetchRecipeReviews = (recipeId, forceFetch) => async (dispatch, getState) => {
  // do not fetch the reviews if it is already in the store
  // and forceFetch is not passed
  if (getState().reviews[recipeId] && !forceFetch) {
    return;
  }
  let response;
  try {
    response = await axios.get(`/api/v1/recipes/${recipeId}/reviews`);
  } catch (error) {
    dispatch(errorFetchReviews(error.response.data));
    return;
  }
  dispatch(receiveFetchReviews(response.data.data, recipeId));
};

