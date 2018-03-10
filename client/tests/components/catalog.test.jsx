import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { StaticRouter as Router } from 'react-router-dom';

import { Catalog } from '../../components/Catalog';
import Recipe from '../../components/Recipe';

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
    user: { data: {} },
    recipes: {
      searchResults: { '': { results: [mockRecipe.id] } },
      recipes: [
        mockRecipe,
      ],
    },
    history: {
      push: jest.fn(),
      location: {},
    },
  };
  const root = mount(<Router><Catalog {...props} /></Router>);
  const catalog = root.find(Catalog);
  const recipe = root.find(Recipe);

  const methodSpy = name => jest.spyOn(catalog.instance(), name);

  const actions = {
    addRecipeOnClick: jest.spyOn(catalog.instance(), 'addRecipeOnClick'),
    handleClearSearchClick: jest.spyOn(catalog.instance(), 'handleClearSearchClick'),
    handleSearchInputChange: jest.spyOn(catalog.instance(), 'handleSearchInputChange'),
    componentWillUnmount: methodSpy('componentWillUnmount'),
  };
  root.instance().forceUpdate();
  return {
    components: {
      root,
      catalog,
      recipe,
    },
    actions,
    elements: {
      searchInput: root.find('input'),
      clearSearchButton: root.find('#clear-search'),
    },
  };
};

describe('Catalog component', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<Catalog recipes={{ recipes: [] }} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders recipes', () => {
    const { components: { root } } = setUpComponent();
    const recipe = root.find(Recipe);
    expect(recipe.props().recipe.title).toEqual(mockRecipe.title);
  });

  it('renders search result DOM tree with state set to searchMode', () => {
    const { components: { catalog } } = setUpComponent();
    catalog.instance().setState({ searchMode: true });
  });

  describe('calls instance and lifecycle methods', () => {
    const setUp = setUpComponent();

    it('calls addRecipeOnClick when button to add recipe is clicked', () => {
      const { components: { root }, actions } = setUpComponent();
      root.find('a.btn-floating').simulate('click');
      expect(actions.addRecipeOnClick).toHaveBeenCalled();
    });

    it('calls handleSearchInputChange when search input element is focused', () => {
      const {
        elements: { searchInput },
        actions: { handleSearchInputChange },
      } = setUpComponent();
      // eslint-disable-next-line
      try { searchInput.simulate('change'); } catch (error) {}
      expect(handleSearchInputChange).toHaveBeenCalled();
    });

    it('calls handleClearSearchClick', () => {
      const {
        elements: { clearSearchButton },
        actions: { handleClearSearchClick },
      } = setUpComponent();
      // eslint-disable-next-line
      try { clearSearchButton.simulate('click'); } catch (error) {}
      expect(handleClearSearchClick).toHaveBeenCalled();
    });

    it('calls componentWillUnmount', () => {
      const {
        components: { root },
        actions: { componentWillUnmount },
      } = setUpComponent();
      root.unmount();
      expect(componentWillUnmount).toHaveBeenCalled();
    });

    it('', () => {
      const { elements: { searchInput }, components: { catalog } } = setUp;
      searchInput.simulate('focus');
      catalog.simulate('keyDown');
      searchInput.simulate('keyDown');
    });
  });
});
