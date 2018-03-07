import React from 'react';
import renderer from 'react-test-renderer';
// import { StaticRouter as Router } from 'react-router-dom';

import { UserProfile } from '../../components/UserProfile';

describe('UserProfile component', () => {
  global.$ = () => ({ tabs: jest.fn() });
  test('matches snapshot', () => {
    const props = { fetchUserRecipes: jest.fn(), userData: {} };
    const component = renderer.create(<UserProfile {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
