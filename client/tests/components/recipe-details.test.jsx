import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { RecipeDetails, mapDispatchToProps, mapStateToProps }
  from '../../components/RecipeDetails';

const setUpComponent = (dynamicProps) => {
  const props = {
    recipe: {
      id: 1000,
      title: 'A great recipe',
      description: 'a great recipe',
      ingredients: 'ingredients1\ningredients2',
      directions: 'direction1\ndirection2',
      images: ['', ''],
      author: {
        imageUrl: 'imageUrl',
        username: 'username',
      },
    },
    user: {
      token: 'token',
    },
    fetchRecipeReviews: jest.fn(),
    history: {
      push: jest.fn(),
      location: {},
    },
    ...dynamicProps,
  };
  const component = shallow(<RecipeDetails {...props} />);
  return {
    component,
  };
};

describe('RecipeDetails component', () => {
  test('matches snapshot', () => {
    const props = {
      fetchRecipe: jest.fn(),
      match: { params: {} },
    };
    const component = renderer.create(<RecipeDetails {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('reviewOnChange method', () => {
    const { component } = setUpComponent();
    const reviewOnChange = methodSpy(component, 'reviewOnChange');
    const setState = methodSpy(component, 'setState');
    reviewOnChange({ target: { value: '1' } });
    expect(setState).toHaveBeenCalledWith({ reviewText: '1' });
  });

  test('reviewSubmit method', () => {
    const { component } = setUpComponent();
    const reviewSubmit = methodSpy(component, 'reviewSubmit');
    const result = reviewSubmit();
    expect(result).toBeUndefined();
  });

  test('componentWillReceiveProps method', () => {
    const { component } = setUpComponent();
    component.instance().componentWillReceiveProps({});
  });

  test('toggleViewMode method', () => {
    const { component } = setUpComponent();
    const setState = methodSpy(component, 'setState');
    component.instance().toggleViewMode();
    expect(setState).toHaveBeenCalled();
  });

  describe('mapStateToProps', () => {
    const state = {
      recipes: {
        requestError: {},
        recipes: [{ id: 1000 }],
      },
      user: { data: { }, recipesVoteStatuses: { 1000: {} } },
      reviews: { 1000: { } },
    };

    const ownProps = { match: { params: { recipeId: 1000 } } };

    test('mapStateToProps', () => {
      const mstp = mapStateToProps(state, ownProps);
      expect(mstp).toHaveProperty('user');
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    test('mapDispatchToProps', () => {
      const mdtp = mapDispatchToProps(dispatch);
      expect(mdtp).toHaveProperty('recipeAction');
      const {
        recipeAction,
        recipeVoteAction,
        fetchRecipe,
        fetchRecipeReviews,
        fetchUserVoteStatuses,
        postRecipeReview,
      } = mdtp;
      recipeAction();
      recipeVoteAction();
      fetchRecipe();
      fetchRecipeReviews();
      fetchUserVoteStatuses();
      postRecipeReview();
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });
});
