import axios from 'axios';
import {
  addToUserRecipes, fetchUserFavorites, fetchRecipeVoteStatuses,
} from './user';

// deal with thunk actions
export const INITIATE_RECIPE_ACTION_REQUEST = 'INITIATE_RECIPE_ACTION_REQUEST';
export const RECEIVE_RECIPE_ACTION_RESPONSE = 'RECEIVE_RECIPE_ACTION_RESPONSE';
export const ERROR_RECIPE_ACTION_REQUEST = 'ERROR_RECIPE_ACTION_REQUEST';

// request types that can be made to the server for a recipe or
// for the whole recipes
export const FETCH_RECIPES = 'FETCH_RECIPES';
export const CREATE_RECIPE = 'CREATE_RECIPE';
export const UPDATE_RECIPE = 'UPDATE_RECIPE';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const FETCH_RECIPE = 'FETCH_RECIPE';

// synchronous actions
export const FETCHED_ALL_RECIPES = 'FETCHED_ALL_RECIPES';

export const initiateRecipeActionRequest = () => ({
  type: INITIATE_RECIPE_ACTION_REQUEST,
});

export const receiveRecipeActionResponse = (requestType, data) => ({
  type: RECEIVE_RECIPE_ACTION_RESPONSE,
  requestType,
  data,
});

export const errorRecipeAction = error => ({
  type: ERROR_RECIPE_ACTION_REQUEST,
  error,
});

export const fetchedAllRecipes = () => ({
  type: FETCHED_ALL_RECIPES,
});


/**
 * @param {number} [limit=6]
 *
 * @returns {Function} thunk function
 */
export const fetchRecipes = (limit = 6) => async (dispatch, getState) => {
  const allRecipesUrl = `/api/v1/recipes?sort=upvotes&limit=${limit}\
&offset=${getState().recipes.recipes.length}`;

  let response;
  dispatch(initiateRecipeActionRequest());
  try {
    response = await axios.get(allRecipesUrl);
  } catch (error) {
    return dispatch(errorRecipeAction(error.response.data));
  }
  if (response.data.data.length < limit) {
    dispatch(fetchedAllRecipes());
  }
  return dispatch(receiveRecipeActionResponse(
    FETCH_RECIPES,
    response.data.data,
  ));
};

export const fetchRecipe = recipeId => async (dispatch) => {
  dispatch(initiateRecipeActionRequest());
  let response;
  try {
    response = await axios.get(`/api/v1/recipes/${recipeId}`);
  } catch (error) {
    dispatch(errorRecipeAction(error.response.data));
    return;
  }
  dispatch(receiveRecipeActionResponse(FETCH_RECIPE, response.data.data));
};

/**
 * @param {string} actionType - one of 'create', 'delete', 'update'
 * @param {Object|string} recipeData - an object or a string representing the
 * recipe data or recipeId
 *
 * @returns {Object} thunk callback function
 */
export const recipeAction = (actionType, recipeData) =>
  async (dispatch, getState) => {
    const userToken = getState().user.data.token;
    const axiosInstance = axios.create({
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const BASEURL = '/api/v1/recipes/';
    let resp;

    dispatch(initiateRecipeActionRequest());
    switch (actionType) {
      case 'create':
        try {
          resp = await axiosInstance.post(BASEURL, recipeData);
        } catch (error) {
          return dispatch(errorRecipeAction(error.response.data));
        }
        dispatch(receiveRecipeActionResponse(CREATE_RECIPE, resp.data.data));
        dispatch(addToUserRecipes(resp.data.data.id));
        break;
      case 'delete':
        try {
          await axiosInstance.delete(`${BASEURL}${recipeData}`);
        } catch (error) {
          return dispatch(errorRecipeAction(error.response.data));
        }
        return dispatch(receiveRecipeActionResponse(DELETE_RECIPE, recipeData));
      case 'update':
        try {
          resp = await axiosInstance.put(
            `${BASEURL}${recipeData.id}`,
            recipeData,
          );
        } catch (error) {
          return dispatch(errorRecipeAction(error.response.data));
        }
        return dispatch(receiveRecipeActionResponse(
          UPDATE_RECIPE,
          resp.data.data,
        ));
      default:
        break;
    }
    return null;
  };

/**
 * @param {any} actionType
 * @param {any} recipeId
 *
 * @returns {Function} thunk function
 */
export const recipeVoteAction = (actionType, recipeId) =>
  async (dispatch, getState) => {
    const userToken = getState().user.data.token;
    let resp;
    dispatch(initiateRecipeActionRequest());
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
    return dispatch(receiveRecipeActionResponse(UPDATE_RECIPE, resp.data.data));
  };
