import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import DetailsView from '../../components/RecipeDetails/DetailsView';

const recipeDetailsSetUp = (dynamicProps) => {
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
    recipeAction: jest.fn(),
    recipeVoteAction: jest.fn(),
    reviews: [{
      user: { username: 'testuser', imageUrl: 'testimageUrl' },
      content: 'reviewcontent',
      createdAt: Date.now(),
    }],
    userOwnsRecipe: () => true,
    reviewText: '',
    reviewOnChange: jest.fn(),
    reviewSubmit: jest.fn(),
    toggleViewMode: jest.fn(),
    userVoteStatuses: {
      upvoted: true,
      downvoted: true,
      favorited: true,
    },
    history: {
      push: jest.fn(),
      location: {},
    },
    ...dynamicProps,
  };
  const component = mount(<DetailsView {...props} />);
  return {
    props,
    component,
    elements: {
      recipeTitle: component.find('h5.title'),
      upvoteBtn: component.find('a#upvote-btn'),
      downvoteBtn: component.find('a#downvote-btn'),
      favoriteBtn: component.find('a#favorite-btn'),
      deleteBtn: component.find('a.btn-floating.red'),
    },
  };
};

describe('RecipeDetails - DetailsView component', () => {
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

  test('renders title correctly', () => {
    const { elements: { recipeTitle }, props } = recipeDetailsSetUp();
    expect(recipeTitle).toHaveText(props.recipe.title);
  });

  test('upvote button calls voteAction function', () => {
    const { elements: { upvoteBtn }, props: { recipeVoteAction } } =
      recipeDetailsSetUp();
    upvoteBtn.simulate('click');
    expect(recipeVoteAction).toHaveBeenCalled();
  });

  test('downvote button calls voteAction function', () => {
    const { elements: { downvoteBtn }, props: { recipeVoteAction, recipe } } =
      recipeDetailsSetUp();
    downvoteBtn.simulate('click');
    expect(recipeVoteAction).toHaveBeenCalledWith('downvote', recipe.id);
  });

  test('favorite button calls voteAction function', () => {
    const { elements: { favoriteBtn }, props: { recipeVoteAction, recipe } } =
      recipeDetailsSetUp();
    favoriteBtn.simulate('click');
    expect(recipeVoteAction).toHaveBeenCalledWith('favorite', recipe.id);
  });

  test('delete button calls recipeAction function', () => {
    const { elements: { deleteBtn }, props: { recipeAction, recipe } } =
      recipeDetailsSetUp();
    deleteBtn.simulate('click');
    expect(recipeAction).toHaveBeenCalledWith('delete', recipe.id);
  });

  test('calls history.push function when user is not signed in', () => {
    const { elements: { upvoteBtn }, props: { history: { push } } } =
      recipeDetailsSetUp({ user: { token: '' } });
    upvoteBtn.simulate('click');
    expect(push).toHaveBeenCalled();
  });
});
