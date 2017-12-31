import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Logo from './logo.jpg';
import { signOutUser } from '../../actions/user';
import './index.scss';

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
    <nav className="white" id="navbar-component">
      <ul className="nav-wrapper container">
        <div id="logo-container">
          <Link to="/catalog" className="brand-logo">
            <img src={Logo} alt="navbar logo" />
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

        {
          props.user.data.token ?
            <ul id="dropdown" className="dropdown-content">
              <li>
                <Link to="/user">My Profile</Link>
                <a onClick={props.signOutUser}>Sign Out</a>
              </li>
            </ul> :
            <ul id="dropdown" className="dropdown-content">
              <li>
                <Link to={{
                  pathname: '/signin',
                  state: {
                    modal: true,
                    previousLocation: props.location.pathname,
                  },
                }}
                >Sign In
                </Link>
              </li>
            </ul>
        }

      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOutUser: () => dispatch(signOutUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
