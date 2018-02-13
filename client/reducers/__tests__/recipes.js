import reducer from '../recipes';
import * as actions from '../../actions/recipes';

const mocks = {
  state: { recipes: [{ id: 40, title: 'an existing recipe' }] },
  createdRecipe: { id: 1, title: 'A great recipe' },
  fetchedRecipes: [],
};

describe('Recipe reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      requestInitiated: false,
      requestError: null,
      recipes: [],
    });
  });

  it('should handle INITIATE_RECIPE_ACTION_REQUEST', () => {
    expect(reducer(undefined, actions.initiateRecipeActionRequest()))
      .toEqual({
        requestInitiated: true,
        requestError: null,
        recipes: [],
      });
  });

  it('should handle ERROR_RECIPE_ACTION_REQUEST', () => {
    const mockError = { error: '' };
    expect(reducer(undefined, actions.errorRecipeAction(mockError)))
      .toEqual({
        requestInitiated: false,
        requestError: mockError,
        recipes: [],
      });
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
      .receiveRecipeActionResponse(actions.FETCH_RECIPES, mocks.fetchedRecipes)))
      .toEqual({
        requestInitiated: false,
        requestError: null,
        recipes: [...mocks.state.recipes, ...mocks.fetchedRecipes],
      });
  });

  it('should handle RECEIVE_RECIPE_ACTION_RESPONSE for DELETE_RECIPE request', () => {
    expect(reducer(mocks.state, actions
      .receiveRecipeActionResponse(actions.DELETE_RECIPE, mocks.state.recipes[0].id)))
      .toEqual({
        requestInitiated: false,
        requestError: null,
        recipes: [],
      });
  });

  it('should handle RECEIVE_RECIPE_ACTION_RESPONSE for UPDATE_RECIPE request', () => {
    expect(reducer(mocks.state, actions
      .receiveRecipeActionResponse(
        actions.UPDATE_RECIPE,
        { ...mocks.state.recipes[0], aNewField: '' },
      )))
      .toEqual({
        requestInitiated: false,
        requestError: null,
        recipes: [{ ...mocks.state.recipes[0], aNewField: '' }],
      });
  });
});
