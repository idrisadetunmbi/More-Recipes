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
 * @param {string} actionType - one of 'create', 'delete' or 'update'
 * @param {any} recipeData - an object or a string representing the recipe data
 * (case - 'create', 'update') or recipe Id
 */
export const recipeAction = (actionType, recipeData) => async (dispatch, getState) => {
  dispatch(initiateRecipeActionRequest(actionType));
  const userToken = getState().user.data.token;

  switch (actionType) {
    case 'create': {
      let resp;
      try {
        resp = await axios.post(
          '/api/v1/recipes',
          recipeData,
          { headers: { Authorization: `Bearer ${userToken}` } },
        );
        const createdRecipeId = resp.data.data.id;
        resp = await axios.get(`/api/v1/recipes/${createdRecipeId}`);
      } catch (error) {
        return dispatch(errorRecipeAction(error.response.data));
      }
      dispatch(receiveRecipeActionResponse(resp.data.data));
    }
      break;
    case 'delete':
      try {
        await axios.delete(
          `/api/v1/recipes/${recipeData}`,
          { headers: { Authorization: `Bearer ${userToken}` } },
        );
      } catch (error) {
        return dispatch(errorRecipeAction(error.response.data));
      }
      dispatch(receiveRecipeActionResponse(recipeData));
      break;
    case 'update': {
      let resp;
      try {
        resp = await axios.put(
          `/api/v1/recipes/${recipeData.id}`,
          recipeData,
          { headers: { Authorization: `Bearer ${userToken}` } },
        );
        resp = await axios.get(`/api/v1/recipes/${recipeData.id}`);
      } catch (error) {
        console.log('An error occured while updating recipe', error);
        return dispatch(errorRecipeAction(error.response.data));
      }
      dispatch(receiveRecipeActionResponse(resp.data.data));
    }
      break;
    default:
      break;
  }
};
