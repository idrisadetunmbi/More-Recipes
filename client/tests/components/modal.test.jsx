import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter as Router } from 'react-router-dom';

import Modal from '../../components/Modal';

describe('Modal component', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<Router><Modal /></Router>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
