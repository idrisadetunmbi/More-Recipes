import { combineReducers } from 'redux';
import recipes from './recipes';
import user from './user';
import reviews from './reviews';

const rootReducer = combineReducers({
  recipes,
  user,
  reviews,
});

export default rootReducer;
