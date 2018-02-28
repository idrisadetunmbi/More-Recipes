import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { CreateRecipe } from './';

Enzyme.configure({ adapter: new Adapter() });

describe('<CreateRecipe />', () => {
  it('matches snapshot', () => {
    const component = renderer
      .create(<CreateRecipe />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('calls onFocus', () => {
    const wrapper = mount(<CreateRecipe />);
    const onFocus = jest.spyOn(wrapper.instance(), 'onFocus');
    wrapper.instance().forceUpdate();
    wrapper.find('input[name="title"]').simulate('focus');
    expect(onFocus).toHaveBeenCalled();
  });

  it('calls onBlur', () => {
    const wrapper = mount(<CreateRecipe />);
    const onBlur = jest.spyOn(wrapper.instance(), 'onBlur');
    wrapper.instance().forceUpdate();
    wrapper.find('input[name="title"]').simulate('blur');
    wrapper.find('textarea[name="description"]').simulate('blur');
    expect(onBlur).toHaveBeenCalled();
  });

  it('calls onChange', () => {
    window.URL.createObjectURL = jest.fn();
    const wrapper = mount(<CreateRecipe />);
    const onChange = jest.spyOn(wrapper.instance(), 'onChange');
    wrapper.instance().forceUpdate();
    wrapper.find('input[name="images upload"]').simulate('change');
    wrapper.setState({ imagesSelected: [1, 2] });
    wrapper.find('input[name="add more images"]').simulate('change');
    expect(onChange).toHaveBeenCalled();
  });
});
