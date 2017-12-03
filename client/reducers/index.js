import { combineReducers } from 'redux';
import recipes from './recipes';
import user from './user';

const rootReducer = combineReducers({
  recipes,
  user,
});

export default rootReducer;
