import axios from 'axios';

export const ERROR_REVIEWS = 'ERROR_REVIEWS';
const errorReviews = error => ({
  type: ERROR_REVIEWS,
  error,
});

export const RECEIVE_REVIEWS = 'RECEIVE_REVIEWS';
const receiveReviews = (data, recipeId) => ({
  type: RECEIVE_REVIEWS,
  recipeId,
  data,
});

/**
 *
 *
 * @param {String} recipeId id of recipe to fetch reviews for
 * @param {Boolean} forceFetch whether to bypass check of recipe reviews
 * availability in the store
 */
export const fetchRecipeReviews = (recipeId, forceFetch) =>
  async (dispatch, getState) => {
    // do not fetch the reviews if it is already in the store
    // and if forceFetch is not passed
    if (getState().reviews[recipeId] && !forceFetch) {
      return;
    }
    let response;
    try {
      response = await axios.get(`/api/v1/recipes/${recipeId}/reviews`);
    } catch (error) {
      dispatch(errorReviews(error.response.data));
      return;
    }
    dispatch(receiveReviews(response.data.data, recipeId));
  };

export const postRecipeReview = (recipeId, reviewData) =>
  async (dispatch, getState) => {
    const userToken = getState().user.data.token;
    try {
      await axios.post(
        `/api/v1/recipes/${recipeId}/reviews`,
        reviewData,
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
    } catch (error) {
      return dispatch(errorReviews(error.response.data));
    }
    return dispatch(fetchRecipeReviews(recipeId, true));
  };

