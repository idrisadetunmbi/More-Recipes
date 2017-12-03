import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';

import rootReducer from './reducers';

const initialState = {
  recipes: {
    isFetching: false,
    error: null,
    recipes: [],
  },
};

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware, loggerMiddleware),
);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
}


export default store;
