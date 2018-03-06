import axios from 'axios';

export const ERROR_REVIEWS = 'ERROR_REVIEWS';
export const errorReviews = error => ({
  type: ERROR_REVIEWS,
  error,
});

export const RECEIVE_REVIEWS = 'RECEIVE_REVIEWS';
export const receiveReviews = (data, recipeId) => ({
  type: RECEIVE_REVIEWS,
  recipeId,
  data,
});

export const ADD_RECIPE_REVIEW = 'ADD_RECIPE_REVIEW';
export const addRecipeReview = (recipeId, data) => ({
  type: ADD_RECIPE_REVIEW,
  recipeId,
  data,
});

/**
 * fetches the reviews of a recipe from the server
 * @param {String} recipeId - id of recipe to fetch reviews for
 * @param {Boolean} forceFetch - whether to bypass check of recipe reviews
 * availability in the store
 * @returns {Promise} thunk function
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

/**
 * Sends the reviews of a recipe to the server
 * @param {any} recipeId - id of recipe to post review for
 * @param {any} reviewData - content of review to be posted
 *
 * @returns {Promise} thunk function
 */
export const postRecipeReview = (recipeId, reviewData) =>
  async (dispatch, getState) => {
    const userToken = getState().user.data.token;
    let response;
    try {
      response = await axios.post(
        `/api/v1/recipes/${recipeId}/reviews`,
        reviewData,
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
    } catch (error) {
      return dispatch(errorReviews(error.response.data));
    }
    return dispatch(addRecipeReview(recipeId, response.data.data));
  };

