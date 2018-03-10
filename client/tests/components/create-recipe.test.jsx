/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { CreateRecipe, mapDispatchToProps, mapStateToProps }
  from '../../components/CreateRecipe';

const setUpComponent = (dynamicProps) => {
  const props = {
    ...dynamicProps,
  };
  const component = mount(<CreateRecipe {...props} />);
  const elements = {
    titleInput: component.find('input[name="title"]'),
    descriptionInput: component.find('textarea[name="description"]'),
    ingredientsInput: component.find('textarea[name="ingredients"]'),
    directionsInput: component.find('textarea[name="directions"]'),
    addImagesInput: component.find('input[name="images upload"]'),
    addRecipeForm: component.find('#create-recipe-component'),
  };
  const methodSpy = name => jest.spyOn(component.instance(), name);
  const methods = {
    componentWillReceiveProps: methodSpy('componentWillReceiveProps'),
    onFocus: methodSpy('onFocus'),
    onBlur: methodSpy('onBlur'),
    onChange: methodSpy('onChange'),
    onSubmit: methodSpy('onSubmit'),
    removeImage: methodSpy('removeImage'),
  };
  component.instance().forceUpdate();
  return {
    component,
    elements,
    methods,
  };
};

describe('CreateRecipe component', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<CreateRecipe />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  describe('calls lifecycle and instance methods', () => {
    const setUp = setUpComponent();

    it('calls onFocus method when an input element is focused', () => {
      const { elements: { titleInput }, methods: { onFocus } } = setUp;
      titleInput.simulate('focus');
      expect(onFocus).toHaveBeenCalled();
    });

    it('calls onBlur method when title input element is blurred', () => {
      const { elements: { titleInput }, methods: { onBlur } } = setUpComponent();
      titleInput.simulate('blur');
      titleInput.simulate('blur', { target: { value: 'A great recipe' } });
      expect(onBlur).toHaveBeenCalledTimes(2);
    });

    it('calls onBlur method when other input element is blurred', () => {
      const { elements: { ingredientsInput }, methods: { onBlur } } = setUpComponent();
      ingredientsInput.simulate('blur');
      ingredientsInput.simulate('blur', { target: { value: 'A great recipe' } });
      expect(onBlur).toHaveBeenCalledTimes(2);
    });

    it('calls onChange when addImage input element is changed', () => {
      window.URL.createObjectURL = jest.fn();
      const {
        elements: { addImagesInput }, methods: { onChange },
      } = setUpComponent();
      addImagesInput.simulate('change');
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when addMoreImage input element is changed', () => {
      window.URL.createObjectURL = jest.fn();
      const { component, methods: { onChange } } = setUpComponent();
      component.instance().setState({ imagesSelected: [1, 2] });
      component.update();
      const addMoreImages = component.find('input[name="add more images"]');
      addMoreImages.simulate('change');
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onSubmit when form is submitted', () => {
      const {
        elements: { addRecipeForm }, methods: { onSubmit }, component,
      } = setUpComponent();
      addRecipeForm.simulate('submit');
      component.instance().setState({ imagesSelected: [1, 2] });
      addRecipeForm.simulate('submit');
      expect(onSubmit).toHaveBeenCalledTimes(2);
    });

    it('calls onSubmit when form is submitted', () => {
      const {
        elements: {
          addRecipeForm, titleInput, descriptionInput, ingredientsInput, directionsInput,
        },
        methods: { onSubmit }, component,
      } = setUpComponent();

      titleInput.simulate('change', { target: { value: 'A great recipe' } });
      ingredientsInput.simulate('change', { target: { value: 'Ingredients' } });
      descriptionInput.simulate('change', { target: { value: 'Description' } });
      directionsInput.simulate('change', { target: { value: 'Directions' } });
      component.instance().setState({ imagesSelected: [1, 2] });
      addRecipeForm.simulate('submit');
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('calls componentWillReceiveProps when a new prop is passed', () => {
      const {
        methods: { componentWillReceiveProps }, component,
      } = setUpComponent({ history: { goBack: jest.fn() } });
      expect(componentWillReceiveProps).not.toHaveBeenCalled();
      component.setProps({});
      component.setProps({ recipeActionInitiated: true });
      component.setProps({ recipeActionInitiated: false, recipeActionErrored: true });
      expect(componentWillReceiveProps).toHaveBeenCalled();
    });

    it('calls removeImage', () => {
      const { methods: { removeImage }, component } = setUpComponent();
      component.instance().setState({ imagesSelected: [1] });
      component.update();
      const removeImgBtn = component.find('#image-preview span');
      removeImgBtn.simulate('click');
      expect(removeImage).toHaveBeenCalled();
    });
  });

  describe('HOC functions', () => {
    const state = { recipes: { requestInitiated: false, requestError: null } };
    test('mapStateToProps', () => {
      const mstp = mapStateToProps(state);
      expect(mstp).toBeInstanceOf(Object);
      expect(mstp).toHaveProperty('recipeActionInitiated');
      expect(mstp).toHaveProperty('recipeActionErrored');
    });

    test('mapDispatchToProps', () => {
      const mdtp = mapDispatchToProps();
      expect(mdtp).toBeInstanceOf(Object);
      expect(mdtp).toHaveProperty('createRecipe');
    });
  });
});
