import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';

import { NavBar, mapDispatchToProps, mapStateToProps } from '../../components/NavBar';

const setUpComponent = (dynamicProps) => {
  const signOutUser = jest.fn();
  const props = {
    ...dynamicProps,
    location: {},
    signOutUser,
  };
  const root = mount(<Router><NavBar {...props} /></Router>);
  const component = root.find(NavBar);

  const methodSpy = name => jest.spyOn(component.instance(), name);
  const methods = {
    componentDidUpdate: methodSpy('componentDidUpdate'),
    signOutUser,
  };
  const elements = {
    userImage: root.find('img.circle'),
    signOutBtn: component.find('a#sign-out'),
  };
  root.instance().forceUpdate();
  return {
    root,
    component,
    methods,
    elements,
  };
};

describe('NavBar component', () => {
  it('matches snapshot', () => {
    global.$ = () => ({ dropdown: jest.fn() });
    const props = {
      user: { data: {} },
      location: { pathname: '' },
    };
    const component = renderer.create(<Router><NavBar {...props} /></Router>);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders user image when image url is passed in', () => {
    const { elements: { userImage } } =
    setUpComponent({ user: { data: { imageUrl: 'url', token: 'token' } } });
    expect(userImage.props().src).toEqual('url');
  });

  it('calls signOutUser when signOutBtn is clicked', () => {
    const { elements: { signOutBtn }, methods: { signOutUser } } =
    setUpComponent({ user: { data: { imageUrl: 'url', token: 'token' } } });
    signOutBtn.simulate('click');
    expect(signOutUser).toHaveBeenCalled();
  });

  describe('conatiner functions', () => {
    test('mapStateToProps', () => {
      expect(mapStateToProps({ user: 'user' })).toHaveProperty('user');
    });

    test('mapDispatchToProps', () => {
      const dispatch = jest.fn();
      expect(mapDispatchToProps(dispatch)).toHaveProperty('signOutUser');

      const { signOutUser } = mapDispatchToProps(dispatch);
      signOutUser();
      expect(dispatch).toHaveBeenCalled();
    });
  });
});
