import React from 'react';
import renderer from 'react-test-renderer';

import NotFoundPage from '../../components/404';

describe('NotFoundPage component', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<NotFoundPage />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
