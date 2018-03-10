/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

import { UserProfile, mapDispatchToProps, mapStateToProps } from
  '../../components/UserProfile';
import { RecipeList } from '../../components/RecipeList';

const mockRecipe = {
  id: 1000,
  title: 'A great recipe',
  description: 'a great recipe',
  ingredients: 'ingredients1\ningredients2',
  directions: 'direction1\ndirection2',
  images: [1, 2],
};

const setUpComponent = (dynamicProps) => {
  const props = {
    ...dynamicProps,
    fetchUserRecipes: jest.fn(),
    userData: { imageUrl: 'mockurl' },
  };
  const component = mount(<UserProfile {...props} />);
  const methods = {
    componentWillMount: methodSpy(component, 'componentWillMount'),
    componentWillReceiveProps: methodSpy(component, 'componentWillReceiveProps'),
    onChangeImageInput: methodSpy(component, 'onChangeImageInput'),
  };
  component.instance().forceUpdate();
  return {
    component,
    methods,
    elements: {
      addRecipeButton: component.find('a.btn-floating'),
      userRecipesTabBtn: component.find('ul.tabs #user-recipes'),
      userFavoritesTabBtn: component.find('ul.tabs #user-favorites'),
      changeUserImageBtn: component.find('input[type="file"]'),
    },
  };
};

describe('UserProfile component', () => {
  test('matches snapshot', () => {
    const props = { fetchUserRecipes: jest.fn(), userData: {} };
    const component = renderer.create(<UserProfile {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('renders addRecipeBtn', () => {
    const props = { history: { location: {}, push: jest.fn() } };
    const { elements: { addRecipeButton } } = setUpComponent(props);
    expect(addRecipeButton).toBePresent();
    addRecipeButton.simulate('click');
    expect(props.history.push).toHaveBeenCalled();
  });

  test('renders userRecipeTabBtn', () => {
    const { elements: { userRecipesTabBtn }, component } = setUpComponent();
    expect(userRecipesTabBtn).toBePresent();
    userRecipesTabBtn.simulate('click');
    expect(component.state().myRecipeTabIsActive).toEqual(true);
  });

  test('renders userFavoritesTabBtn', () => {
    const props = { fetchUserFavorites: jest.fn() };
    const { elements: { userFavoritesTabBtn }, component } =
      setUpComponent(props);
    expect(userFavoritesTabBtn).toBePresent();
    userFavoritesTabBtn.simulate('click');
    expect(component.state().myRecipeTabIsActive).toEqual(false);
  });

  test('renders list of recipes when passed', () => {
    const props = {
      userRecipes: [mockRecipe],
      fetchUserRecipes: jest.fn(),
      userData: { imageUrl: 'mockurl' },
    };
    const component = shallow(<UserProfile {...props} />);
    const recipeList = component.find(RecipeList);
    expect(recipeList).toBePresent();
    expect(recipeList.props().recipes).toEqual(props.userRecipes);
  });

  test('calls componentWillReceiveProps when new props are recieved', () => {
    const props = {
      userData: { imageUrl: 'mockurl' },
      history: { replace: jest.fn() },
    };
    const { component, methods: { componentWillReceiveProps } } =
      setUpComponent(props);
    component.setProps({ userData: {} });
    expect(componentWillReceiveProps).toHaveBeenCalled();
  });

  test('onChangeImageInput', () => {
    const { elements: { changeUserImageBtn }, methods: { onChangeImageInput } }
      = setUpComponent();
    changeUserImageBtn.simulate('change');
    expect(onChangeImageInput).toHaveBeenCalled();
  });

  describe('conatiner functions', () => {
    test('mapStateToProps', () => {
      const state = {
        recipes: { recipes: [mockRecipe] },
        user: { recipes: [mockRecipe.id], favoriteRecipes: [mockRecipe.id] },
      };
      expect(mapStateToProps(state)).toHaveProperty('userData');
      expect(mapStateToProps(state)).toHaveProperty('userFavorites');
      expect(mapStateToProps(state)).toHaveProperty('userRecipes');
    });

    test('mapDispatchToProps', () => {
      const dispatch = jest.fn();
      expect(mapDispatchToProps(dispatch)).toHaveProperty('fetchUserRecipes');
      expect(mapDispatchToProps(dispatch)).toHaveProperty('fetchUserFavorites');
      expect(mapDispatchToProps(dispatch)).toHaveProperty('updateUserProfilePhoto');


      const { fetchUserRecipes, fetchUserFavorites, updateUserProfilePhoto } =
        mapDispatchToProps(dispatch);
      fetchUserFavorites();
      fetchUserRecipes();
      updateUserProfilePhoto();
      expect(dispatch).toHaveBeenCalledTimes(3);
    });
  });
});
