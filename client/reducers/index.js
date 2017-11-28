import { combineReducers } from 'redux';
import recipes from './recipes';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  recipes,
  router: routerReducer,
});

export default rootReducer;
