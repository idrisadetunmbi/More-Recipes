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
            <h5>MoreRecipes</h5>
          </Link>
        </div>
        <ul className="right">
          <li>
            <Link to={linkTo} className="dropdown-button" data-activates="dropdown">
              {
                props.user.data.imageUrl ?
                  <img src={props.user.data.imageUrl} alt="" width="38" height="38" className="circle" /> :
                  <i style={{ fontSize: '3rem' }} className="large material-icons">
                    account_circle
                  </i>
               }
              <i className="material-icons">arrow_drop_down</i>
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
