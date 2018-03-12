/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter as Router } from 'react-router-dom';
import { mount, shallow } from 'enzyme';

import { SignUp, mapDispatchToProps, mapStateToProps } from '../../components/SignUp';

const setUpComponent = (dynamicProps) => {
  const props = {
    ...dynamicProps,
    user: {
      userRequestInitiated: false,
    },
    location: { state: {} },
  };
  const root = mount(<Router {...props}><SignUp {...props} /></Router>);
  const component = root.find(SignUp);
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
      emailField: component.find('input[name="email"]'),
      confirmPwdField: component.find('input[name="passwordConfirm"]'),
      signUpForm: component.find('.auth-component'),
    },
  };
};

describe('SignUp component', () => {
  test('matches snapshot', () => {
    const props = { user: {}, location: {} };
    const component = renderer.create(<Router><SignUp {...props} /></Router>);
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
    const comp = shallow(<SignUp {...props} />);
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

  test('calls onChange with email input field change', () => {
    const { methods: { onChange }, elements: { emailField } }
      = setUpComponent();
    emailField.simulate('change');
    emailField.simulate('change', { target: { name: 'email', value: 'xyz@mail.com' } });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  test('calls onSubmit', () => {
    const signUpUser = jest.fn();
    const {
      methods: { onSubmit }, elements: {
        signUpForm, emailField, passwordField, usernameField,
      },
    } = setUpComponent({ signUpUser });
    usernameField.simulate('change', { target: { name: 'username', value: 'username' } });
    passwordField.simulate('change', { target: { name: 'password', value: 'username' } });
    passwordField.simulate('change', { target: { name: 'passwordConfirm', value: 'username' } });
    emailField.simulate('change', { target: { name: 'email', value: 'xyz@mail.com' } });
    signUpForm.simulate('submit');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(signUpUser).toHaveBeenCalled();
  });

  describe('conatiner functions', () => {
    test('mapStateToProps', () => {
      expect(mapStateToProps({ user: 'user' })).toHaveProperty('user');
    });

    test('mapDispatchToProps', () => {
      const dispatch = jest.fn();
      expect(mapDispatchToProps(dispatch)).toHaveProperty('signUpUser');

      const { signUpUser } = mapDispatchToProps(dispatch);
      signUpUser();
      expect(dispatch).toHaveBeenCalled();
    });
  });
});
