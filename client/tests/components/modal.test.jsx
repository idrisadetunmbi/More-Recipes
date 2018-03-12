import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';

import Modal from '../../components/Modal';

const setUpComponent = (dynamicProps) => {
  const props = {
    ...dynamicProps,
    history: {
      replace: jest.fn(),
    },
    location: { state: {} },
  };
  const root = mount(<Router><Modal {...props} /></Router>);
  const component = root.find(Modal);
  const elements = {
    containerDiv: component.find('#modal-component'),
    modalContent: component.find('.modal-content'),
  };
  const methodSpy = name => jest.spyOn(component.instance(), name);

  const methods = {
    componentDidMount: methodSpy('componentDidMount'),
    back: methodSpy('back'),
    escKeyPress: methodSpy('escKeyPress'),
    componentWillUnmount: methodSpy('componentWillUnmount'),
  };
  root.instance().forceUpdate();
  return {
    root,
    component,
    elements,
    methods,
  };
};

describe('Modal component', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<Router><Modal /></Router>);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('calls back method when containerDiv is clicked ', () => {
    const { methods: { back }, elements: { containerDiv } } = setUpComponent();
    containerDiv.simulate('click');
    expect(back).toHaveBeenCalled();
  });

  it('', () => {
    const { elements: { modalContent } } = setUpComponent();
    modalContent.simulate('click');
  });

  it('calls component will unmount when component unmounts ', () => {
    const { methods: { componentWillUnmount }, root } = setUpComponent();
    root.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });
});
