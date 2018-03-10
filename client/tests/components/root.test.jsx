import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import Root from '../../components/Root';

describe('App component', () => {
  test.skip('matches snapshot', () => {
    const mockStore = configureStore([]);
    const store = mockStore({ state: {}, user: { data: {} } });
    store.getState = jest.fn();
    const props = {
      store: { getState: jest.fn() }, user: {}, location: {},
    };

    let component;
    // eslint-disable-next-line
      component = renderer.create(
        <Provider store={store}>
          <Router>
            <Root {...props} />
          </Router>
        </Provider>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
