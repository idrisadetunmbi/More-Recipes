import {
  INITIATE_RECIPE_ACTION_REQUEST,
  ERROR_RECIPE_ACTION_REQUEST,
  RECEIVE_RECIPE_ACTION_RESPONSE,
  FETCH_RECIPE,
  FETCH_RECIPES,
  FETCHED_ALL_RECIPES,
  CREATE_RECIPE,
  SEARCH_RECIPES,
  DELETE_RECIPE,
  UPDATE_RECIPE,
  MATCHED_ALL_RECIPES,
  RECEIVE_SEARCH_RESULTS,
} from '../actions/recipes';

const removeDuplicates = (recipes) => {
  const unduplicatedIds = [];
  const unduplicatedRecipes = [];
  recipes.forEach((recipe) => {
    if (!unduplicatedIds.includes(recipe.id)) {
      unduplicatedIds.push(recipe.id);
      unduplicatedRecipes.push(recipe);
    }
  });
  return unduplicatedRecipes;
};

const sortRecipes = (recipes, newRecipes) => {
  const allRecipes = [...recipes, ...newRecipes];
  allRecipes.sort((a, b) => a.upvotes < b.upvotes);
  return removeDuplicates(allRecipes);
};

const updateRecipes = (recipes = [], { requestType, data }) => {
  switch (requestType) {
    case FETCH_RECIPES:
      return [...recipes, ...data];
    case FETCH_RECIPE:
      return sortRecipes(recipes, [data]);
    case CREATE_RECIPE:
      return [data, ...recipes];
    case SEARCH_RECIPES:
      return sortRecipes(recipes, data);
    case DELETE_RECIPE: {
      return recipes.filter(recipe => recipe.id !== data);
    }
    case UPDATE_RECIPE:
      return recipes.map((recipe) => {
        if (recipe.id === data.id) {
          return data;
        }
        return recipe;
      });
    default:
      return recipes;
  }
};

const updateSearchResults = (state = {}, action) => {
  const currentSearchTerm = state[action.searchTerm];
  switch (action.type) {
    case RECEIVE_SEARCH_RESULTS:
      return {
        ...state,
        [action.searchTerm]: {
          ...currentSearchTerm,
          results: [
            ...action.recipeIds,
            ...currentSearchTerm ? currentSearchTerm.results : [],
          ],
        },
      };
    case MATCHED_ALL_RECIPES:
      return {
        ...state,
        [action.searchTerm]: {
          ...currentSearchTerm,
          matchedAll: true,
        },
      };
    default:
      return state;
  }
};

const recipes = (state = {
  requestInitiated: false,
  requestError: null,
  recipes: [],
  searchResults: {},
  fetchedAll: false,
}, action) => {
  switch (action.type) {
    case INITIATE_RECIPE_ACTION_REQUEST:
      return {
        ...state,
        requestInitiated: true,
        requestError: null,
      };
    case ERROR_RECIPE_ACTION_REQUEST:
      return {
        ...state,
        requestInitiated: false,
        requestError: action.error,
      };
    case RECEIVE_RECIPE_ACTION_RESPONSE:
      return {
        ...state,
        requestInitiated: false,
        requestError: null,
        recipes: updateRecipes(state.recipes, action),
      };
    case FETCHED_ALL_RECIPES:
      return {
        ...state,
        fetchedAll: true,
      };
    case RECEIVE_SEARCH_RESULTS:
    case MATCHED_ALL_RECIPES:
      return {
        ...state,
        searchResults: updateSearchResults(state.searchResults, action),
      };
    default:
      return state;
  }
};

export default recipes;
