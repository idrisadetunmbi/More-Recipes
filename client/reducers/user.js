import * as UserActions from '../actions/user';

const convertActionType = (action) => {
  switch (action) {
    case UserActions.AUTHENTICATION:
    case UserActions.UPDATE_PROFILE_PHOTO:
      return 'data';
    case UserActions.FETCH_RECIPES:
      return 'recipes';
    case UserActions.FETCH_FAVORITES:
      return 'favoriteRecipes';
    default:
      return null;
  }
};

const user = (state = {
  userRequestInitiated: false,
  userRequestError: null,
  data: {},
  recipes: null,
  favoriteRecipes: null,
}, action) => {
  switch (action.type) {
    case UserActions.INITIATE_USER_REQUEST:
      return {
        ...state,
        userRequestInitiated: true,
        userRequestError: null,
        requestType: action.requestType,
      };
    case UserActions.ERROR_USER_REQUEST:
      return {
        ...state,
        userRequestInitiated: false,
        userRequestError: action.error,
      };
    case UserActions.RECEIVE_USER_REQUEST_RESPONSE:
      return {
        ...state,
        requestType: undefined,
        userRequestError: null,
        userRequestInitiated: false,
        [convertActionType(state.requestType)]: action.data,
      };
    case UserActions.RESET_USER_DATA:
      return {
        userRequestInitiated: false,
        userRequestError: null,
        data: {},
        recipes: null,
        favoriteRecipes: null,
      };
    case UserActions.ADD_TO_USER_RECIPES:
      return {
        ...state,
        recipes: !state.recipes ?
          [action.recipeId] :
          [action.recipeId, ...state.recipes],
      };
    default:
      return state;
  }
};

export default user;

