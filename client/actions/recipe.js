import axios from 'axios';

export const INITIATE_RECIPE_ACTION_REQUEST = 'INITIATE_RECIPE_ACTION_REQUEST';
export const initiateRecipeActionRequest = (actionType) => {
  return {
    type: INITIATE_RECIPE_ACTION_REQUEST,
    actionType,
  };
};

export const RECEIVE_RECIPE_ACTION_RESPONSE = 'RECEIVE_RECIPE_ACTION_RESPONSE';
export const receiveRecipeActionResponse = (recipe) => {
  return {
    type: RECEIVE_RECIPE_ACTION_RESPONSE,
    recipe,
  };
};

export const ERROR_RECIPE_ACTION_REQUEST = 'ERROR_RECIPE_ACTION_REQUEST';
export const errorRecipeAction = (error) => {
  return {
    type: ERROR_RECIPE_ACTION_REQUEST,
    error,
  };
};

/**
 *
 * @param {string} actionType - one of 'create', 'delete', 'update', or 'vote' actions
 * @param {any} recipeData - an object or a string representing the recipe data or recipeId
 */
export const recipeAction = (actionType, recipeData) => async (dispatch, getState) => {
  const userToken = getState().user.data.token;
  const axiosInstance = axios.create({ headers: { Authorization: `Bearer ${userToken}` } });
  const BASEURL = '/api/v1/recipes/';
  let resp;

  dispatch(initiateRecipeActionRequest(actionType));
  switch (actionType) {
    case 'create':
      try {
        resp = await axiosInstance.post(BASEURL, recipeData);
        resp = await axiosInstance.get(`${BASEURL}${resp.data.data.id}`);
      } catch (error) {
        return dispatch(errorRecipeAction(error.response.data));
      }
      return dispatch(receiveRecipeActionResponse(resp.data.data));
    case 'delete':
      try {
        await axiosInstance.delete(`${BASEURL}${recipeData}`);
      } catch (error) {
        return dispatch(errorRecipeAction(error.response.data));
      }
      return dispatch(receiveRecipeActionResponse(recipeData));
    case 'update':
      try {
        await axiosInstance.put(`${BASEURL}${recipeData.id}`, recipeData);
        resp = await axiosInstance.get(`${BASEURL}${recipeData.id}`);
      } catch (error) {
        return dispatch(errorRecipeAction(error.response.data));
      }
      return dispatch(receiveRecipeActionResponse(resp.data.data));
    case 'upvote':
      try {
        await axiosInstance.post(`${BASEURL}${recipeData}?action=upvote`);
        resp = await axios.get(`/api/v1/recipes/${recipeData}`);
      } catch (error) {
        return dispatch(errorRecipeAction(error.response.data));
      }
      return dispatch(receiveRecipeActionResponse(resp.data.data));
    case 'downvote':
      try {
        await axiosInstance.post(`${BASEURL}${recipeData}?action=downvote`);
        resp = await axios.get(`/api/v1/recipes/${recipeData}`);
      } catch (error) {
        return dispatch(errorRecipeAction(error.response.data));
      }
      return dispatch(receiveRecipeActionResponse(resp.data.data));
    default:
      break;
  }
};
