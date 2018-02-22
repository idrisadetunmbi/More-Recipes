import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Logo from './logo.jpg';
import { signOutUser } from '../../actions/user';
import './index.scss';

const NavBar = (props) => {
  const signInRedirect = {
    pathname: '/signin',
    state: { modal: true, previousLocation: props.location.pathname },
  };

  // eslint-disable-next-line
  const renderRightContent = () => props.user.data.token ?
    <li>
      <a className="dropdown-button" data-beloworigin="true" data-activates="dropdown">
        {
          props.user.data.imageUrl ?
            <img src={props.user.data.imageUrl} alt="" width="38" height="38" className="circle" /> :
            <i style={{ fontSize: '3rem' }} className="large material-icons">account_circle</i>
        }
        <span className="black-text">{props.user.data.username}</span>
        <i className="material-icons">arrow_drop_down</i>
      </a>
    </li> :
    <li>
      <Link to={signInRedirect}>Sign In</Link>
    </li>;

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
          {renderRightContent()}
        </ul>

        <ul id="dropdown" className="dropdown-content">
          <li>
            <Link to="/user"><i className="material-icons">person</i>My Profile</Link>
            <a onClick={props.signOutUser}><i className="material-icons">exit_to_app</i>Sign Out</a>
          </li>
        </ul>
      </ul>
    </nav>
  );
};

NavBar.propTypes = {
  // eslint-disable-next-line
  user: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  signOutUser: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({ user: state.user });

const mapDispatchToProps = dispatch =>
  ({
    signOutUser: () => dispatch(signOutUser()),
  });

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
