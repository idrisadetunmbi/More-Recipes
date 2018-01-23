import axios from 'axios';

export const INITIATE_USER_REQUEST = 'INITIATE_USER_REQUEST';
export const ERROR_USER_REQUEST = 'ERROR_USER_REQUEST';
export const RESET_USER_DATA = 'RESET_USER_DATA';
export const RECEIVE_USER_REQUEST_RESPONSE = 'RECEIVE_USER_REQUEST_RESPONSE';
export const ADD_TO_USER_RECIPES = 'ADD_TO_USER_RECIPES';

// User request types
export const FETCH_RECIPES = 'FETCH_RECIPES';
export const AUTHENTICATION = 'AUTHENTICATION';
export const FETCH_FAVORITES = 'FETCH_FAVORITES';
export const UPDATE_PROFILE_PHOTO = 'UPDATE_PROFILE_PHOTO';

export const initiateUserRequest = requestType => ({
  type: INITIATE_USER_REQUEST,
  requestType,
});

export const errorUserRequest = error => ({
  type: ERROR_USER_REQUEST,
  error,
});

export const receiveUserRequestResponse = data => ({
  type: RECEIVE_USER_REQUEST_RESPONSE,
  data,
});

export const signOutUser = () => ({
  type: RESET_USER_DATA,
});

export const addToUserRecipes = recipeId => ({
  type: ADD_TO_USER_RECIPES,
  recipeId,
});


export const userAuthRequest = (userData, authType) => async (dispatch) => {
  dispatch(initiateUserRequest(AUTHENTICATION));
  let response;
  try {
    response = await axios.post(`/api/v1/users/${authType}`, userData);
  } catch (error) {
    dispatch(errorUserRequest(error.response.data));
    return;
  }
  dispatch(receiveUserRequestResponse(response.data.data));
};

export const fetchUserRecipes = () => async (dispatch, getState) => {
  // if user's recipes have already being fetched
  if (getState().user.recipes) {
    return;
  }
  const userId = getState().user.data.id;
  let response;
  dispatch(initiateUserRequest(FETCH_RECIPES));
  try {
    response = await axios.get(`/api/v1/users/${userId}/recipes`);
  } catch (error) {
    dispatch(errorUserRequest(error.response.data));
    return;
  }
  const recipeIds = response.data.data.recipes.map(recipe => recipe.id);
  dispatch(receiveUserRequestResponse(recipeIds));
};

export const fetchUserFavorites = forceFetch => async (dispatch, getState) => {
  // if user's favorite recipes have already being fetched
  if (getState().user.favoriteRecipes && !forceFetch) {
    return;
  }
  const userId = getState().user.data.id;
  let response;
  dispatch(initiateUserRequest(FETCH_FAVORITES));
  try {
    response = await axios.get(`/api/v1/users/${userId}/recipes/favorites`);
  } catch (error) {
    dispatch(errorUserRequest(error.response.data));
    return;
  }
  dispatch(receiveUserRequestResponse(response.data.data));
};

export const updateUserProfilePhoto = imageUrl => async (dispatch, getState) => {
  const userToken = getState().user.data.token;
  dispatch(initiateUserRequest(UPDATE_PROFILE_PHOTO));
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
  dispatch(receiveUserRequestResponse({
    ...response.data.data, token: userToken,
  }));
};
