import axios from 'axios';

// deals with thunk actions
export const INITIATE_USER_REQUEST = 'INITIATE_USER_REQUEST';
export const ERROR_USER_REQUEST = 'ERROR_USER_REQUEST';
export const RECEIVE_USER_REQUEST_RESPONSE = 'RECEIVE_USER_REQUEST_RESPONSE';

export const RESET_USER_DATA = 'RESET_USER_DATA';
export const ADD_TO_USER_RECIPES = 'ADD_TO_USER_RECIPES';

// these constants denotes the user request actions to the server
export const FETCH_RECIPES = 'FETCH_RECIPES';
export const AUTHENTICATION = 'AUTHENTICATION';
export const FETCH_FAVORITES = 'FETCH_FAVORITES';
export const UPDATE_PROFILE_PHOTO = 'UPDATE_PROFILE_PHOTO';
export const FETCH_RECIPE_VOTE_STATUS = 'FETCH_RECIPE_VOTE_STATUS';

export const initiateUserRequest = () => ({
  type: INITIATE_USER_REQUEST,
});

export const errorUserRequest = error => ({
  type: ERROR_USER_REQUEST,
  error,
});

export const receiveUserRequestResponse = (requestType, data) => ({
  type: RECEIVE_USER_REQUEST_RESPONSE,
  requestType,
  data,
});

export const signOutUser = () => ({
  type: RESET_USER_DATA,
});

export const addToUserRecipes = recipeId => ({
  type: ADD_TO_USER_RECIPES,
  recipeId,
});


/**
 * Thunk function for user authentication
 * @param {Object } userData - an object representing the data of the user to
 * be authenticated
 * @param {string} authType - authentication type - one of 'signup' or 'signin'
 *
 * @returns {Promise} thunk function
 */
export const userAuthRequest = (userData, authType) => async (dispatch) => {
  dispatch(initiateUserRequest());
  let response;
  try {
    response = await axios.post(`/api/v1/users/${authType}`, userData);
  } catch (error) {
    dispatch(errorUserRequest(error.response.data));
    return;
  }
  dispatch(receiveUserRequestResponse(AUTHENTICATION, response.data.data));
};

// TODO: check the fetched recipes and see if the main catalog of recipes
// contains all the retrieved recipes. If not, add the recipes to the catalog.

/**
 * Thunk function for fetching user recipes
 * @returns {Promise} thunk function
 */
export const fetchUserRecipes = () => async (dispatch, getState) => {
  // if user's recipes have already being fetched
  if (getState().user.recipes) {
    return;
  }
  const userId = getState().user.data.id;
  let response;
  dispatch(initiateUserRequest());
  try {
    response = await axios.get(`/api/v1/users/${userId}/recipes`);
  } catch (error) {
    dispatch(errorUserRequest(error.response.data));
    return;
  }
  const recipeIds = response.data.data.recipes.map(recipe => recipe.id);
  dispatch(receiveUserRequestResponse(FETCH_RECIPES, recipeIds));
};

/**
 * Thunk function for fetching user's favorite recipes
 * @param {boolean} forceFetch - whether to force fetch the recipes
 *
 * @returns {Promise} thunk function
 */
export const fetchUserFavorites = forceFetch => async (dispatch, getState) => {
  // if user's favorite recipes have already being fetched
  if (getState().user.favoriteRecipes && !forceFetch) {
    return;
  }
  const userId = getState().user.data.id;
  let response;
  dispatch(initiateUserRequest());
  try {
    response = await axios.get(`/api/v1/users/${userId}/recipes/favorites`);
  } catch (error) {
    dispatch(errorUserRequest(error.response.data));
    return;
  }
  dispatch(receiveUserRequestResponse(FETCH_FAVORITES, response.data.data));
};

/**
 * Thunk function for updating the user's profile picture
 * @param {string} imageUrl - url of the user's image
 *
 * @returns {Promise} thunk function
 */
export const updateUserProfilePhoto = imageUrl =>
  async (dispatch, getState) => {
    const userToken = getState().user.data.token;
    dispatch(initiateUserRequest());
    let response;
    try {
      response = await axios.put(
        '/api/v1/users/',
        { imageUrl },
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
    } catch (error) {
      dispatch(errorUserRequest(error.response.data));
      return;
    }
    dispatch(receiveUserRequestResponse(UPDATE_PROFILE_PHOTO, {
      ...response.data.data, token: userToken,
    }));
  };

/**
 * Thunk function for getting the vote statuses of a user on a recipe
 * @param {string} recipeId - id of the recipe to fetch vote statuses for
 * @param {boolean} forceFetch - whether to make the request to the server
 *
 * @returns {Promise} thunk function
 */
export const fetchRecipeVoteStatuses = (recipeId, forceFetch) =>
  async (dispatch, getState) => {
    // do not fetch again if this recipe's vote statuses have been
    // fetched already
    if (getState().user.recipesVoteStatuses[recipeId] && !forceFetch) {
      return;
    }
    const userToken = getState().user.data.token;
    let response;
    dispatch(initiateUserRequest());
    try {
      response = await axios.get(
        `/api/v1/users/${recipeId}/vote-statuses`,
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
    } catch (error) {
      dispatch(errorUserRequest(error.response.data));
      return;
    }
    dispatch(receiveUserRequestResponse(
      FETCH_RECIPE_VOTE_STATUS,
      { recipeId, ...response.data.data },
    ));
  };
