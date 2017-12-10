import axios from 'axios';

export const INITIATE_RECIPE_ACTION_REQUEST = 'INITIATE_RECIPE_ACTION_REQUEST';
export const initiateRecipeActionRequest = (actionType) => {
  return {
    type: INITIATE_RECIPE_ACTION_REQUEST,
    actionType,
  };
};

export const RECEIVE_RECIPE_ACTION_RESPONSE = 'RECEIVE_RECIPE_ACTION_RESPONSE';
export const receiveRecipeActionResponse = (response) => {
  return {
    type: RECEIVE_RECIPE_ACTION_RESPONSE,
    response,
  };
};

export const ERROR_RECIPE_ACTION_REQUEST = 'ERROR_RECIPE_ACTION_REQUEST';
export const errorRecipeAction = (error) => {
  return {
    type: ERROR_RECIPE_ACTION_REQUEST,
    error,
  };
};

export const recipeAction = (actionType, recipeData) => (dispatch, getState) => {
  console.log('I am dispatched too with', actionType, recipeData);
  dispatch(initiateRecipeActionRequest(actionType));
  const userToken = getState().user.data.token;
  switch (actionType) {
    case 'create':
      return axios.post(
        '/api/v1/recipes',
        recipeData,
        { headers: { Authorization: `Bearer ${userToken}` } },
      )
        .then(
          (response) => {
            const createdRecipeId = response.data.data.id;
            return axios.get(`/api/v1/recipes/${createdRecipeId}`)
              .then((resp) => {
                dispatch(receiveRecipeActionResponse(resp.data.data));
              });
          },
          error => dispatch(errorRecipeAction(error.response.data)),
        );
    default:
      break;
  }
};
