import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './components/landing_page';

ReactDOM.render(<LandingPage />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
