import reducer from '../../reducers/recipes';
import * as actions from '../../actions/recipes';

const mocks = {
  state: {
    recipes: [
      { id: 40, title: 'an existing recipe', upvotes: 1 },
      { id: 3, title: '', upvotes: 1 },
    ],
  },
  createdRecipe: { id: 1, title: 'A great recipe' },
  fetchedRecipes: [],
  error: {},
  fetchedRecipe: { id: 10, upvotes: 2 },
};

describe('Recipe reducer', () => {
  it('should return the initial state', () => {
    const expectedState = {
      fetchedAll: false,
      requestInitiated: false,
      requestError: null,
      recipes: [],
      searchResults: {},
    };
    expect(reducer(undefined, {})).toEqual(expectedState);
  });

  it('should handle INITIATE_RECIPE_ACTION_REQUEST', () => {
    const expectedState = {
      requestInitiated: true,
      requestError: null,
      ...mocks.state,
    };
    expect(reducer(mocks.state, actions.initiateRecipeActionRequest()))
      .toEqual(expectedState);
  });

  it('should handle ERROR_RECIPE_ACTION_REQUEST', () => {
    const expectedState = {
      ...mocks.state,
      requestError: mocks.error,
      requestInitiated: false,
    };
    expect(reducer(mocks.state, actions.errorRecipeAction(mocks.error)))
      .toEqual(expectedState);
  });

  it('should handle RECEIVE_RECIPE_ACTION_RESPONSE for CREATE_RECIPE request', () => {
    expect(reducer(mocks.state, actions
      .receiveRecipeActionResponse(actions.CREATE_RECIPE, mocks.createdRecipe)))
      .toEqual({
        requestInitiated: false,
        requestError: null,
        recipes: [mocks.createdRecipe, ...mocks.state.recipes],
      });
  });

  it('should handle RECEIVE_RECIPE_ACTION_RESPONSE for FETCH_RECIPES request', () => {
    expect(reducer(mocks.state, actions
      .receiveRecipeActionResponse(
        actions.FETCH_RECIPES,
        mocks.fetchedRecipes,
      )))
      .toEqual({
        requestInitiated: false,
        requestError: null,
        recipes: [...mocks.state.recipes, ...mocks.fetchedRecipes],
      });
  });

  it('should handle RECEIVE_RECIPE_ACTION_RESPONSE for DELETE_RECIPE request', () => {
    expect(reducer(mocks.state, actions
      .receiveRecipeActionResponse(
        actions.DELETE_RECIPE,
        mocks.state.recipes[0].id,
      )))
      .toEqual({
        requestInitiated: false,
        requestError: null,
        recipes: [mocks.state.recipes[1]],
      });
  });

  it('should handle RECEIVE_RECIPE_ACTION_RESPONSE for UPDATE_RECIPE request', () => {
    const updatedRecipe = { ...mocks.state.recipes[0], aNewField: '' };
    expect(reducer(mocks.state, actions
      .receiveRecipeActionResponse(actions.UPDATE_RECIPE, updatedRecipe)))
      .toEqual({
        requestInitiated: false,
        requestError: null,
        recipes: [updatedRecipe, mocks.state.recipes[1]],
      });
  });

  it('should handle RECEIVE_RECIPE_ACTION_RESPONSE for FETCH_RECIPE request', () => {
    const expectedState = {
      requestInitiated: false,
      requestError: null,
      recipes: [mocks.fetchedRecipe, ...mocks.state.recipes],
    };
    expect(reducer(mocks.state, actions
      .receiveRecipeActionResponse(actions.FETCH_RECIPE, mocks.fetchedRecipe)))
      .toEqual(expectedState);
  });

  it('should handle RECEIVE_RECIPE_ACTION_RESPONSE for SEARCH_RECIPES request', () => {
    const expectedState = {
      requestInitiated: false,
      requestError: null,
      recipes: [mocks.fetchedRecipe, ...mocks.state.recipes],
    };
    expect(reducer(mocks.state, actions
      // eslint-disable-next-line
      .receiveRecipeActionResponse(actions.SEARCH_RECIPES, [mocks.fetchedRecipe])))
      .toEqual(expectedState);
  });

  it('should handle FETCHED_ALL_RECIPES', () => {
    const expectedState = {
      ...mocks.state,
      fetchedAll: true,
    };
    expect(reducer(mocks.state, actions.fetchedAllRecipes()))
      .toEqual(expectedState);
  });

  it('should handle RECEIVE_SEARCH_RESULTS', () => {
    const expectedState = {
      ...mocks.state,
      searchResults: { '': { results: [1] } },
    };
    expect(reducer(mocks.state, actions.receiveSearchResults('', [1])))
      .toEqual(expectedState);
  });

  it('should handle MATCHED_ALL_RECIPES', () => {
    const expectedState = {
      ...mocks.state,
      searchResults: { '': { matchedAll: true } },
    };
    expect(reducer(mocks.state, actions.matchedAllRecipes('')))
      .toEqual(expectedState);
  });
});
