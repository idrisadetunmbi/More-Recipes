import React from 'react';
import renderer from 'react-test-renderer';
// import { StaticRouter as Router } from 'react-router-dom';

import { RecipeDetails } from '../../components/RecipeDetails';
import EditView from '../../components/RecipeDetails/EditView';
import DetailsView from '../../components/RecipeDetails/DetailsView';

describe('RecipeDetails component', () => {
  test('matches snapshot', () => {
    const props = {
      fetchRecipe: jest.fn(),
      match: { params: {} },
    };
    const component = renderer.create(<RecipeDetails {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  describe('EditView child component', () => {
    test('matches snapshot', () => {
      const props = {
        user: {},
        recipe: {
          images: [],
          ingredients: { replace: jest.fn() },
          directions: { replace: jest.fn() },
        },
      };
      const component = renderer.create(<EditView {...props} />);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe('DetailsView child component', () => {
    test('matches snapshot', () => {
      const props = {
        userOwnsRecipe: jest.fn(),
        user: { data: {} },
        recipe: {
          author: {},
          images: { slice: () => [] },
          ingredients: { split: () => [], replace: jest.fn() },
          directions: { split: () => [], replace: jest.fn() },
        },
      };
      const component = renderer.create(<DetailsView {...props} />);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
