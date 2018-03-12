import React from 'react';
import renderer from 'react-test-renderer';

import Recipe from '../../components/Recipe';

describe('Recipe component', () => {
  test('matches snapshot', () => {
    const props = { recipe: { images: [] } };
    const component = renderer.create(<Recipe {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
