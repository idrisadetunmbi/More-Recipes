import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Catalog } from '../Catalog';
import { RecipeList } from '../RecipeList';

Enzyme.configure({ adapter: new Adapter() });

describe('<Catalog />', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<Catalog recipes={{ recipes: [] }} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders <RecipeList /> component', () => {
    const wrapper = shallow(<Catalog recipes={{ recipes: [] }} />);
    expect(wrapper.find(RecipeList)).toBeTruthy();
  });

  it('simulates click events', () => {
    const addRecipeButton = jest.fn();
    const wrapper = shallow(<Catalog recipes={{ recipes: [] }} />);
    try { wrapper.find('.btn-floating').simulate('click'); } catch (error) {}
    expect(addRecipeButton).toHaveBeenCalled();
  });
});
