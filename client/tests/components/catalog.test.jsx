import React from 'react';
import renderer from 'react-test-renderer';

import { Catalog } from '../../components/Catalog';

describe('Catalog component', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<Catalog recipes={{ recipes: [] }} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
