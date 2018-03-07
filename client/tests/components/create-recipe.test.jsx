import React from 'react';
import renderer from 'react-test-renderer';

import { CreateRecipe } from '../../components/CreateRecipe';

describe('CreateRecipe component', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<CreateRecipe />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
