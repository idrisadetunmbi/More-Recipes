import React from 'react';
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
        <li><a href="catalog.html">Browse Catalog</a></li>
        <li><a href="./">Sign Up</a></li>
        <li><a className="modal-trigger" href="./">Sign In</a></li>
        <li><a id="about-btn" href="./">About</a></li>
      </ul>
    </div>
  </nav>
);

export default NavBar;
