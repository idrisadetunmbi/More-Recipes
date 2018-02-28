import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import * as actions from '../recipes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const moxiosRespondWithSuccess = () => {
  moxios.wait(() => {
    const request = moxios.requests.mostRecent();
    request.respondWith({
      status: 200,
      response: { data: [] },
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

describe('Recipe actions', () => {
  describe('initiateRecipeActionRequest', () => {
    it('should return an object with a type property', () => {
      const actionResult = actions.initiateRecipeActionRequest();
      expect(actionResult.type).toBeDefined();
    });

    it('should create an action to initiate a request', () => {
      const actionResult = actions.initiateRecipeActionRequest();
      expect(actionResult).toEqual({
        type: actions.INITIATE_RECIPE_ACTION_REQUEST,
      });
    });
  });

  describe('receiveRecipeActionResponse', () => {
    it('should return an object with a type property', () => {
      const actionResult = actions.receiveRecipeActionResponse(null, null);
      expect(actionResult.type).toBeDefined();
    });

    it('should create an action to receive a request', () => {
      const actionResult = actions
        .receiveRecipeActionResponse(actions.FETCH_RECIPES, {});
      expect(actionResult).toEqual({
        type: actions.RECEIVE_RECIPE_ACTION_RESPONSE,
        requestType: actions.FETCH_RECIPES,
        data: {},
      });
    });
  });

  describe('errorRecipeAction', () => {
    it('should return an object with a type property', () => {
      const actionResult = actions.errorRecipeAction(null);
      expect(actionResult.type).toBeDefined();
    });

    it('should create an action to receive a request error', () => {
      const actionResult = actions.errorRecipeAction({});
      expect(actionResult).toEqual({
        type: actions.ERROR_RECIPE_ACTION_REQUEST,
        error: {},
      });
    });
  });

  describe('async actions', () => {
    let store;

    beforeEach(() => {
      moxios.install();
      store = mockStore({
        recipes: { recipes: [] },
        user: { data: { token: '' }, recipesVoteStatuses: {} },
      });
    });

    afterEach(() => {
      moxios.uninstall();
    });

    describe('fetchRecipes', () => {
      it('dispatches the expected actions for a successful request', () => {
        moxiosRespondWithSuccess();
        const expectedActions = [
          actions.initiateRecipeActionRequest(),
          actions.receiveRecipeActionResponse(actions.FETCH_RECIPES, []),
        ];
        return store.dispatch(actions.fetchRecipes()).then(() => {
          expect(store.getActions()).toContainEqual(...expectedActions);
        });
      });

      it('dispatches the expected actions for a failed request', () => {
        moxiosRespondWithError();
        const expectedActions = [
          actions.initiateRecipeActionRequest(),
          actions.errorRecipeAction({}),
        ];
        return store.dispatch(actions.fetchRecipes()).catch(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('recipeAction', () => {
      it('dispatches the expected actions for a successful request', () => {
        moxiosRespondWithSuccess();
        const expectedActions = [
          actions.initiateRecipeActionRequest(),
          actions.receiveRecipeActionResponse(actions.CREATE_RECIPE, []),
        ];
        return store.dispatch(actions.recipeAction('create', {})).then(() => {
          expect(store.getActions())
            .toContainEqual(...expectedActions);
        });
      });

      it('calls the expected actions for a failed request', () => {
        moxiosRespondWithError();
        const expectedActions = [
          actions.initiateRecipeActionRequest(),
          actions.errorRecipeAction({}),
        ];
        return store.dispatch(actions.recipeAction('create', {})).catch(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('recipeVoteAction', () => {
      it('dispatches the expected actions for a successful request', () => {
        moxiosRespondWithSuccess();
        const expectedActions = [
          actions.initiateRecipeActionRequest(),
          actions.receiveRecipeActionResponse(actions.UPDATE_RECIPE, {}),
        ];
        return store.dispatch(actions.recipeVoteAction('', '')).then(() => {
          expect(store.getActions()).toContainEqual(...expectedActions);
        });
      });

      it('dispatches the expected actions for a failed request', () => {
        moxiosRespondWithError();
        const expectedActions = [
          actions.initiateRecipeActionRequest(),
          actions.errorRecipeAction({}),
        ];
        return store.dispatch(actions.recipeVoteAction('', '')).catch(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
});
