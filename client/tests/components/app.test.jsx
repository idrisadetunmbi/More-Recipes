import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { App, mapDispatchToProps, mapStateToProps } from '../../components/App';

describe('App component', () => {
  test('matches snapshot', () => {
    const mockStore = configureStore([]);
    const store = mockStore({ user: { data: {} } });
    const props = {
      fetchRecipes: jest.fn(), store: {}, user: {}, location: {},
    };

    const component =
    // eslint-disable-next-line
    renderer.create(
      <Provider store={store}>
        <Router>
          <App {...props} />
        </Router>
      </Provider>);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('calls componentWillUpdate when setState is called', () => {
    const props = {
      fetchRecipes: jest.fn(),
      location: { state: {} },
      history: {},
    };
    const component = shallow(<App {...props} />);
    const componentWillUpdate =
      jest.spyOn(component.instance(), 'componentWillUpdate');
    component.setState({ aNewState: '' });
    expect(componentWillUpdate).toHaveBeenCalled();
  });

  test('renders a route componenet with "/" path', () => {
    const props = {
      fetchRecipes: jest.fn(),
      location: { state: {} },
      history: {},
      userData: {},
    };
    const component = shallow(<App {...props} />);
    const route = component.find({ path: '/' });
    route.props().render();
    expect(route).toBeTruthy();
  });

  describe('conatiner functions', () => {
    test('mapStateToProps', () => {
      expect(mapStateToProps({ user: {} })).toHaveProperty('userData');
    });

    test('mapDispatchToProps', () => {
      const dispatch = jest.fn();
      expect(mapDispatchToProps(dispatch)).toHaveProperty('fetchRecipes');

      const { fetchRecipes } = mapDispatchToProps(dispatch);
      fetchRecipes();
      expect(dispatch).toHaveBeenCalled();
    });
  });
});
