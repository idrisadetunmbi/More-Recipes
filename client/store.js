import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';

import rootReducer from './reducers';

// load initial user data from local storage if available
const cachedUserData = JSON.parse(localStorage.getItem('user'));

const store = cachedUserData ? createStore(
  rootReducer,
  { user: cachedUserData },
  applyMiddleware(thunkMiddleware, loggerMiddleware),
) :
  createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
}


export default store;
