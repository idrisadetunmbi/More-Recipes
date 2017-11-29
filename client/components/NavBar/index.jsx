import React from 'react';
import { Link } from 'react-router-dom';

import './index.css';
import Logo from './logo.jpg';

const NavBar = () => (
  <nav className="white">
    <div className="nav-wrapper container">
      <div id="logo-container">
        <a href="." className="brand-logo">
          <img style={{ height: '56px', verticalAlign: 'middle' }} src={Logo} alt="" />
        </a>
      </div>
      <ul className="right">
        <li>
          <a href="#!" className="dropdown-button" data-activates="dropdown">
            <i style={{ fontSize: '3rem' }} className="large material-icons">
              account_circle
              <i style={{ marginLeft: '0px' }} className="material-icons right">arrow_drop_down</i>
            </i>
          </a>
        </li>
      </ul>
      <ul id="dropdown" className="dropdown-content">
        <li>
          <Link to="/signup">Sign In</Link>
        </li>
        <li><a href="#!">two</a></li>
        <li><a href="#!">three</a></li>
      </ul>
    </div>
  </nav>
);

export default NavBar;
