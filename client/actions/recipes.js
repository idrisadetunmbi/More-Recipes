import axios from 'axios';

export const REQUEST_RECIPES = 'REQUEST_RECIPES';
export const requestRecipes = () => {
  return {
    type: REQUEST_RECIPES,
  };
};

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';
export const receiveRecipes = (recipes) => {
  return {
    type: RECEIVE_RECIPES,
    recipes,
  };
};

export const ERROR_RECIPES_REQUEST = 'ERROR_RECIPES_REQUEST';
export const errorRecipes = (error) => {
  return {
    type: ERROR_RECIPES_REQUEST,
    error,
  };
};

export const fetchRecipes = () => (dispatch) => {
  dispatch(requestRecipes());
  return axios.get('/api/v1/recipes/')
    .then(
      response => dispatch(receiveRecipes(response.data.data)),
      error => dispatch(errorRecipes(error)),
    );
};
