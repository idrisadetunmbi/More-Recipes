import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const middlewares = [thunk];
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares),
);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    // eslint-disable-next-line
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
}


export default store;
