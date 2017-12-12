import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './index.css';
import Logo from './logo.jpg';

const NavBar = (props) => {
  const linkTo = props.user.data.token ?
    '/user' :
    {
      pathname: '/signin',
      state: {
        modal: true,
        previousLocation: props.location.pathname,
      },
    };


  return (
    <nav className="white">
      <ul className="nav-wrapper container">
        <div id="logo-container">
          <Link to="/" className="brand-logo">
            <img style={{ height: '56px', verticalAlign: 'middle' }} src={Logo} alt="" />
          </Link>
        </div>
        <ul className="right">
          <li>
            <Link to={linkTo} className="dropdown-button" data-activates="dropdown">
              <i style={{ fontSize: '3rem' }} className="large material-icons">
                account_circle
                <i style={{ marginLeft: '0px' }} className="material-icons right">arrow_drop_down</i>
              </i>
            </Link>
          </li>
        </ul>
        
        <ul id="dropdown" className="dropdown-content">
          <li>
            <Link to={linkTo}>{props.user.data.token ? 'My Profile' : 'Sign In'}</Link>
          </li>
        </ul>

      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(NavBar);
