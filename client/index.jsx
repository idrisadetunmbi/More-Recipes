import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Root from './components/containers/Root';
import store from './store';


ReactDOM.render(
  <Root store={store} />,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
