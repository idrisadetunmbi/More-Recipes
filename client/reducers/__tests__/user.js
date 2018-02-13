import reducer from '../user';
import * as actions from '../../actions/user';

const mocks = {
  state: {
    userRequestInitiated: false,
    userRequestError: null,
    data: {},
    recipes: null,
    favoriteRecipes: null,
    recipesVoteStatuses: {},
  },
  error: {},
  responseData: {},
  recipesVoteStatusesResponse: { recipeId: 1, voteStatuses: {} },
};

describe('User reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(mocks.state);
  });

  it('should handle INITIATE_RECIPE_ACTION_REQUEST', () => {
    expect(reducer(mocks.state, actions.initiateUserRequest()))
      .toEqual({
        ...mocks.state,
        userRequestInitiated: true,
      });
  });

  it('should handle ERROR_USER_REQUEST', () => {
    expect(reducer(mocks.state, actions.errorUserRequest(mocks.error)))
      .toEqual({
        ...mocks.state,
        userRequestError: mocks.error,
      });
  });

  it('should handle RECEIVE_USER_REQUEST_RESPONSE for FETCH_RECIPES request', () => {
    expect(reducer(mocks.state, actions
      .receiveUserRequestResponse(actions.FETCH_RECIPES, mocks.responseData)))
      .toEqual({
        ...mocks.state,
        recipes: mocks.responseData,
      });
  });

  it('should handle RECEIVE_USER_REQUEST_RESPONSE for AUTHENTICATION request', () => {
    expect(reducer(mocks.state, actions
      .receiveUserRequestResponse(actions.AUTHENTICATION, mocks.responseData)))
      .toEqual({
        ...mocks.state,
        data: mocks.responseData,
      });
  });

  it('should handle RECEIVE_USER_REQUEST_RESPONSE for FETCH_FAVORITES request', () => {
    expect(reducer(mocks.state, actions
      .receiveUserRequestResponse(actions.FETCH_FAVORITES, mocks.responseData)))
      .toEqual({
        ...mocks.state,
        favoriteRecipes: mocks.responseData,
      });
  });

  it('should handle RECEIVE_USER_REQUEST_RESPONSE for UPDATE_PROFILE_PHOTO request', () => {
    expect(reducer(mocks.state, actions
      .receiveUserRequestResponse(
        actions.UPDATE_PROFILE_PHOTO,
        mocks.responseData,
      )))
      .toEqual({
        ...mocks.state,
        data: mocks.responseData,
      });
  });

  it('should handle RECEIVE_USER_REQUEST_RESPONSE for FETCH_RECIPE_VOTE_STATUS request', () => {
    expect(reducer(mocks.state, actions
      .receiveUserRequestResponse(
        actions.FETCH_RECIPE_VOTE_STATUS,
        mocks.responseData,
      )))
      .toEqual({
        ...mocks.state,
        recipesVoteStatuses: { undefined: {} },
      });
  });

  it('should handle RESET_USER_DATA', () => {
    expect(reducer(mocks.state, actions.signOutUser()))
      .toEqual(mocks.state);
  });

  it('should handle ADD_TO_USER_RECIPES', () => {
    expect(reducer(mocks.state, actions.addToUserRecipes(1)))
      .toEqual({ ...mocks.state, recipes: [1] });
  });
});
