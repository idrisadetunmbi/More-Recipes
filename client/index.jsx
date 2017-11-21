import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const App = () => (
  <div>
    <h1 style={{ fontFamily: 'Roboto' }}>React is live</h1>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
