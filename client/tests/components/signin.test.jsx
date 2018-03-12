/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';
import { StaticRouter as Router } from 'react-router-dom';

import { SignIn, mapDispatchToProps, mapStateToProps } from '../../components/SignIn';

const setUpComponent = (dynamicProps) => {
  const props = {
    ...dynamicProps,
    user: {
      userRequestInitiated: false,
    },
    location: { state: {} },
  };
  const root = mount(<Router {...props}><SignIn {...props} /></Router>);
  const component = root.find(SignIn);
  const methods = {
    componentWillReceiveProps: methodSpy(component, 'componentWillReceiveProps'),
    onChange: jest.spyOn(component.instance(), 'onChange'),
    onSubmit: methodSpy(component, 'onSubmit'),
  };
  component.instance().forceUpdate();
  return {
    root,
    methods,
    component,
    elements: {
      usernameField: component.find('input[name="username"]'),
      passwordField: component.find('input[name="password"]'),
      signUpForm: component.find('.auth-component'),
    },
  };
};

describe('SignIn component', () => {
  test('matches snapshot', () => {
    const props = { user: {}, location: {} };
    const component = renderer.create(<Router><SignIn {...props} /></Router>);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('calls componentWillReceiveProps when new props are passed', () => {
    const props = {
      user: {
        userRequestInitiated: false,
      },
      location: { state: {} },
      history: { replace: jest.fn() },
    };
    const comp = shallow(<SignIn {...props} />);
    const cwrp = jest.spyOn(comp.instance(), 'componentWillReceiveProps');
    comp.setProps({ user: { userRequestInitiated: true } });
    comp.setProps({
      user: { userRequestInitiated: false, userRequestError: { error: [] } },
    });
    comp.setProps({
      user: { userRequestInitiated: false, userRequestError: false },
    });
    expect(cwrp).toHaveBeenCalledTimes(3);
  });

  test('calls onChange with username input field change', () => {
    const { methods: { onChange }, elements: { usernameField } }
      = setUpComponent();
    usernameField.simulate('change');
    usernameField.simulate('change', { target: { name: 'username', value: 'username' } });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  test('calls onChange with password input field change', () => {
    const { methods: { onChange }, elements: { passwordField } }
      = setUpComponent();
    passwordField.simulate('change');
    passwordField.simulate('change', { target: { name: 'password', value: 'username' } });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  test('calls onSubmit', () => {
    const signInUser = jest.fn();
    const {
      methods: { onSubmit }, elements: {
        signUpForm, passwordField, usernameField,
      },
    } = setUpComponent({ signInUser });
    usernameField.simulate('change', { target: { name: 'username', value: 'username' } });
    passwordField.simulate('change', { target: { name: 'password', value: 'username' } });
    signUpForm.simulate('submit');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(signInUser).toHaveBeenCalled();
  });

  describe('conatiner functions', () => {
    test('mapStateToProps', () => {
      expect(mapStateToProps({ user: 'user' })).toHaveProperty('user');
    });

    test('mapDispatchToProps', () => {
      const dispatch = jest.fn();
      expect(mapDispatchToProps(dispatch)).toHaveProperty('signInUser');

      const { signInUser } = mapDispatchToProps(dispatch);
      signInUser();
      expect(dispatch).toHaveBeenCalled();
    });
  });
});
