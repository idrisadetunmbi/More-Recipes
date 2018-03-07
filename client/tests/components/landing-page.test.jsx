import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter as Router } from 'react-router-dom';

import { LandingPage } from '../../components/LandingPage';

describe('LandingPage component', () => {
  it('matches snapshot', () => {
    const props = {
      recipes: {
        recipes: [],
        requestInitiated: false,
        requestError: null,
      },
    };
    const component = renderer
      .create(<Router><LandingPage {...props} /></Router>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
