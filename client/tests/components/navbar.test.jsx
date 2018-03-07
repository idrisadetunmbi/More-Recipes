import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter as Router } from 'react-router-dom';

import { NavBar } from '../../components/NavBar';

describe('NavBar component', () => {
  test('matches snapshot', () => {
    global.$ = () => ({ dropdown: jest.fn() });
    const props = {
      user: { data: {} },
      location: { pathname: '' },
    };
    const component = renderer.create(<Router><NavBar {...props} /></Router>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
