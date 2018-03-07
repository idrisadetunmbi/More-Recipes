import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter as Router } from 'react-router-dom';

import { SignUp } from '../../components/SignUp';

describe('SignUp component', () => {
  test('matches snapshot', () => {
    const props = { user: {}, location: {} };
    const component = renderer.create(<Router><SignUp {...props} /></Router>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
