import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import EditView from '../../components/RecipeDetails/EditView';

const setUpEditView = (dynamicProps) => {
  const props = {
    toggleViewMode: jest.fn(),
    recipeAction: jest.fn(),
    user: { id: 1 },
    recipe: {
      id: 1000,
      title: 'A great recipe',
      description: 'a great recipe',
      ingredients: 'ingredients1\ningredients2',
      directions: 'direction1\ndirection2',
      images: [''],
      authorId: 1,
      author: {
        imageUrl: 'imageUrl',
        username: 'username',
      },
    },
    ...dynamicProps,
  };
  const component = mount(<EditView {...props} />);
  const methods = {
    onChange: methodSpy(component, 'onChange'),
    onBlur: methodSpy(component, 'onBlur'),
    onFocus: methodSpy(component, 'onFocus'),
    onSubmit: methodSpy(component, 'onSubmit'),
    confirmNoDataChanges: methodSpy(component, 'confirmNoDataChanges'),
    removeImage: methodSpy(component, 'removeImage'),
  };
  component.instance().forceUpdate();
  return {
    component,
    methods,
    elements: {
      titleField: component.find('textarea[name="title"]'),
      descriptionField: component.find('textarea[name="description"]'),
      ingredientsField: component.find('textarea[name="ingredients"]'),
      directionsField: component.find('textarea[name="directions"]'),
      removeImageBtn: component.find('#thumbnails-row i'),
      addMoreImagesBtn: component.find('input[type="file"]'),
      submitBtn: component.find('#submit-btn'),
    },
  };
};


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

  test('onFocus method', () => {
    const { elements: { titleField }, methods: { onFocus } } = setUpEditView();
    titleField.simulate('focus');
    expect(onFocus).toHaveBeenCalled();
  });

  test('onBlur method', () => {
    const { elements: { titleField }, methods: { onBlur } } = setUpEditView();
    titleField.simulate('blur');
    titleField.simulate('blur', { target: { value: '' } });
    expect(onBlur).toHaveBeenCalledTimes(2);
  });

  test('removeImage method', () => {
    const { elements: { removeImageBtn }, methods: { removeImage } } =
      setUpEditView();
    removeImageBtn.simulate('click');
    expect(removeImage).toHaveBeenCalled();
  });

  test('addMoreImages method', () => {
    window.URL.createObjectURL = jest.fn();
    const { component, elements: { addMoreImagesBtn }, methods: { onChange } } =
      setUpEditView();
    component.setState({ newImages: [{ name: 'name' }] });
    addMoreImagesBtn.simulate(
      'change',
      { target: { name: 'add more images', files: [{ name: 'name' }] } },
    );
    expect(onChange).toHaveBeenCalled();
  });

  test('onSubmit method', () => {
    window.URL.createObjectURL = jest.fn();
    const {
      component, elements: { submitBtn }, methods:
      { onSubmit },
    } =
      setUpEditView();
    component.setState({ newImages: [{ name: 'name' }] });
    submitBtn.simulate('click');
    expect(onSubmit).toHaveBeenCalled();
  });
});
