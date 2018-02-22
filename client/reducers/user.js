import * as UserActions from '../actions/user';
import { hydrateUserData } from '../utils';

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

const receiveUserRequestResponse = (state, action) => {
  switch (action.requestType) {
    case UserActions.FETCH_RECIPE_VOTE_STATUS: {
      const { recipeId, ...voteStatuses } = action.data;
      return {
        recipesVoteStatuses: {
          ...state.recipesVoteStatuses,
          [recipeId]: voteStatuses,
        },
      };
    }
    default:
      return {
        [convertActionType(action.requestType)]: action.data,
      };
  }
};

const user = (state = {
  userRequestInitiated: false,
  userRequestError: null,
  data: hydrateUserData() || {},
  recipes: null,
  favoriteRecipes: null,
  recipesVoteStatuses: {},
}, action) => {
  switch (action.type) {
    case UserActions.INITIATE_USER_REQUEST:
      return {
        ...state,
        userRequestInitiated: true,
        userRequestError: null,
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
        userRequestError: null,
        userRequestInitiated: false,
        ...receiveUserRequestResponse(state, action),
      };
    case UserActions.RESET_USER_DATA:
      return {
        userRequestInitiated: false,
        userRequestError: null,
        data: {},
        recipes: null,
        favoriteRecipes: null,
        recipesVoteStatuses: {},
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

