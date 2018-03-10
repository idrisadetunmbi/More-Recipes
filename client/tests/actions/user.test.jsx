import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import * as actions from '../../actions/user';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const moxiosRespondWithSuccess = () => {
  moxios.wait(() => {
    const request = moxios.requests.mostRecent();
    request.respondWith({
      status: 200,
      response: { data: {} },
    });
  });
};

const moxiosRespondWithError = () => {
  moxios.wait(() => {
    const request = moxios.requests.mostRecent();
    request.respondWith({
      status: 400,
      error: {},
    });
  });
};

describe('User actions', () => {
  describe('initiateUserRequest', () => {
    const action = actions.initiateUserRequest();
    it('should return an object with a type property', () => {
      expect(action.type).toBeDefined();
    });

    it('should create an action to initiate a request', () => {
      expect(action).toEqual({
        type: actions.INITIATE_USER_REQUEST,
      });
    });
  });

  describe('receiveUserRequestResponse', () => {
    const action = actions.receiveUserRequestResponse();
    it('should return an object with a type property', () => {
      expect(action.type).toBeDefined();
    });

    it('should create an action to receive a request', () => {
      expect(action).toEqual({
        type: actions.RECEIVE_USER_REQUEST_RESPONSE,
      });
    });
  });

  describe('errorUserRequest', () => {
    const action = actions.errorUserRequest();
    it('should return an object with a type property', () => {
      expect(action.type).toBeDefined();
    });

    it('should create an action to receive a request error', () => {
      expect(action).toEqual({
        type: actions.ERROR_USER_REQUEST,
      });
    });
  });

  describe('signOutUser', () => {
    const action = actions.signOutUser();
    it('should return an object with a type property', () => {
      expect(action.type).toBeDefined();
    });

    it('should create an action to reset user data', () => {
      expect(action).toEqual({
        type: actions.RESET_USER_DATA,
      });
    });
  });

  describe('addToUserRecipes', () => {
    const action = actions.addToUserRecipes();
    it('should return an object with a type property', () => {
      expect(action.type).toBeDefined();
    });

    it('should create an action to add to user recipes list', () => {
      expect(action).toEqual({
        type: actions.ADD_TO_USER_RECIPES,
      });
    });
  });

  describe('async actions', () => {
    let store;

    beforeEach(() => {
      moxios.install();
      store = mockStore({
        user: { data: { token: '' }, recipesVoteStatuses: {} },
      });
    });

    afterEach(() => {
      moxios.uninstall();
    });

    describe('userAuthRequest', () => {
      it('dispatches the expected actions for a successful request', async () => {
        moxiosRespondWithSuccess();
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.receiveUserRequestResponse(actions.AUTHENTICATION, {}),
        ];
        await store.dispatch(actions.userAuthRequest());
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('dispatches the expected actions for a failed request', () => {
        moxiosRespondWithError();
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.errorUserRequest({}),
        ];
        return store.dispatch(actions.userAuthRequest()).catch(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('fetchUserRecipes', () => {
      it('dispatches the expected actions for a successful request', async () => {
        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: { data: { recipes: [] } },
          });
        });
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.receiveUserRequestResponse(actions.FETCH_RECIPES, []),
        ];
        await store.dispatch(actions.fetchUserRecipes());
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('dispatches the expected actions for a failed request', () => {
        moxiosRespondWithError();
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.errorUserRequest({}),
        ];
        return store.dispatch(actions.fetchUserRecipes()).catch(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('fetchUserFavorites', () => {
      it('dispatches the expected actions for a successful request', async () => {
        moxiosRespondWithSuccess();
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.receiveUserRequestResponse(actions.FETCH_FAVORITES, {}),
        ];
        await store.dispatch(actions.fetchUserFavorites());
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('dispatches the expected actions for a failed request', () => {
        moxiosRespondWithError();
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.errorUserRequest({}),
        ];
        return store.dispatch(actions.fetchUserFavorites()).catch(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('updateUserProfilePhoto', () => {
      it('dispatches the expected actions for a successful request', async () => {
        moxiosRespondWithSuccess();
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.receiveUserRequestResponse(actions.UPDATE_PROFILE_PHOTO, { token: '' }),
        ];
        await store.dispatch(actions.updateUserProfilePhoto());
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('dispatches the expected actions for a failed request', () => {
        moxiosRespondWithError();
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.errorUserRequest({}),
        ];
        return store.dispatch(actions.updateUserProfilePhoto()).catch(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('fetchRecipeVoteStatuses', () => {
      it('dispatches the expected actions for a successful request', async () => {
        moxiosRespondWithSuccess();
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.receiveUserRequestResponse(actions
            .FETCH_RECIPE_VOTE_STATUS, {}),
        ];
        await store.dispatch(actions.fetchRecipeVoteStatuses());
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('dispatches the expected actions for a failed request', () => {
        moxiosRespondWithError();
        const expectedActions = [
          actions.initiateUserRequest(),
          actions.errorUserRequest({}),
        ];
        return store.dispatch(actions.fetchRecipeVoteStatuses()).catch(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
});
