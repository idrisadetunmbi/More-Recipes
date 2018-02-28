import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Catalog } from '../Catalog';

Enzyme.configure({ adapter: new Adapter() });

describe('<Catalog />', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<Catalog recipes={{ recipes: [] }} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('simulates click events', () => {
    const wrapper = mount(<Catalog recipes={{ recipes: [] }} user={{ data: { } }} history={{ location: { pathname: '' }, push: jest.fn() }} />);
    const addRecipeOnClick = jest.spyOn(wrapper.instance(), 'addRecipeOnClick');
    wrapper.instance().forceUpdate();
    wrapper.find('.btn-floating').simulate('click');
    expect(addRecipeOnClick).toHaveBeenCalled();
  });
});
