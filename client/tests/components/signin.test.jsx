import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter as Router } from 'react-router-dom';

import { SignIn } from '../../components/SignIn';

describe('SignIn component', () => {
  test('matches snapshot', () => {
    const props = { user: {}, location: {} };
    const component = renderer.create(<Router><SignIn {...props} /></Router>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
