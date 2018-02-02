import axios from 'axios';
import {
  addToUserRecipes, fetchUserFavorites, fetchRecipeVoteStatuses,
} from './user';

export const INITIATE_RECIPE_ACTION_REQUEST = 'INITIATE_RECIPE_ACTION_REQUEST';
export const initiateRecipeActionRequest = actionType => ({
  type: INITIATE_RECIPE_ACTION_REQUEST,
  actionType,
});

export const RECEIVE_RECIPE_ACTION_RESPONSE = 'RECEIVE_RECIPE_ACTION_RESPONSE';
export const receiveRecipeActionResponse = recipe => ({
  type: RECEIVE_RECIPE_ACTION_RESPONSE,
  recipe,
});

export const ERROR_RECIPE_ACTION_REQUEST = 'ERROR_RECIPE_ACTION_REQUEST';
export const errorRecipeAction = error => ({
  type: ERROR_RECIPE_ACTION_REQUEST,
  error,
});

/**
 *
 * @param {string} actionType - one of 'create', 'delete', 'update'
 * @param {Object|string} recipeData - an object or a string representing the
 * recipe data or recipeId
 * @returns {Promise} none
 */
export const recipeAction = (actionType, recipeData) =>
  async (dispatch, getState) => {
    const userToken = getState().user.data.token;
    const axiosInstance = axios.create({
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const BASEURL = '/api/v1/recipes/';
    let resp;

    dispatch(initiateRecipeActionRequest(actionType));
    switch (actionType) {
      case 'create':
        try {
          resp = await axiosInstance.post(BASEURL, recipeData);
        } catch (error) {
          return dispatch(errorRecipeAction(error.response.data));
        }
        dispatch(receiveRecipeActionResponse(resp.data.data));
        dispatch(addToUserRecipes(resp.data.data.id));
        break;
      case 'delete':
        try {
          await axiosInstance.delete(`${BASEURL}${recipeData}`);
        } catch (error) {
          return dispatch(errorRecipeAction(error.response.data));
        }
        return dispatch(receiveRecipeActionResponse(recipeData));
      case 'update':
        try {
          resp = await axiosInstance.put(`${BASEURL}${recipeData.id}`, recipeData);
        } catch (error) {
          return dispatch(errorRecipeAction(error.response.data));
        }
        return dispatch(receiveRecipeActionResponse(resp.data.data));
      default:
        break;
    }
  };

export const recipeVoteAction = (actionType, recipeId) =>
  async (dispatch, getState) => {
    const userToken = getState().user.data.token;
    let resp;
    dispatch(initiateRecipeActionRequest(actionType));
    try {
      resp = await axios.post(
        `/api/v1/recipes/${recipeId}/${actionType}`,
        {}, { headers: { Authorization: `Bearer ${userToken}` } },
      );
    } catch (error) {
      return dispatch(errorRecipeAction(error.response.data));
    }
    if (actionType === 'favorite') {
      dispatch(fetchUserFavorites(true));
    }
    dispatch((fetchRecipeVoteStatuses(recipeId, true)));
    return dispatch(receiveRecipeActionResponse(resp.data.data));
  };
