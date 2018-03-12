import React from 'react';
import renderer from 'react-test-renderer';
// import { StaticRouter as Router } from 'react-router-dom';

import { InputField, TextArea, LoaderWithComponent } from '../../components/reusables';

describe('Reusable components', () => {
  describe('InputField', () => {
    test('matches snapshot', () => {
      const component = renderer.create(<InputField />);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe('TextArea', () => {
    test('matches snapshot', () => {
      const component = renderer.create(<TextArea />);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe('LoaderWithComponent', () => {
    test('matches snapshot', () => {
      const component = renderer.create(<LoaderWithComponent showLoader />);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
