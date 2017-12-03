import React from 'react';
import { Link } from 'react-router-dom';

import './index.css';
import Logo from './logo.jpg';

const NavBar = props => (
  <nav className="white">
    <ul className="nav-wrapper container">
      <div id="logo-container">
        <a href="." className="brand-logo">
          <img style={{ height: '56px', verticalAlign: 'middle' }} src={Logo} alt="" />
        </a>
      </div>
      <ul className="right">
        <li>
          <Link to={{pathname: '/signin', state: { modal: true, previousLocation: props.location.pathname }}} className="dropdown-button" data-activates="dropdown">
            <i style={{ fontSize: '3rem' }} className="large material-icons">
              account_circle
              <i style={{ marginLeft: '0px' }} className="material-icons right">arrow_drop_down</i>
            </i>
          </Link>
        </li>
      </ul>
      
      <ul id="dropdown" className="dropdown-content">
        <li>
          <Link to={{pathname: '/signin', state: { modal: true, previousLocation: props.location.pathname }}}>Sign In</Link>
        </li>
      </ul>

    </ul>
  </nav>
);

export default NavBar;
