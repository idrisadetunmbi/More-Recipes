import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Logo from './logo.jpg';
import { signOutUser } from '../../actions/user';
import './index.scss';

/**
 * @class NavBar
 * @extends {React.Component}
 */
class NavBar extends React.Component {
  /**
   * @returns {void}
   * @memberOf NavBar
   */
  componentDidMount() {
    // for navbar dropdown menu
    $('.dropdown-button').dropdown({
      belowOrigin: true,
      alignment: 'left',
    });
  }

  /**
   * @returns {void}
   * @memberOf NavBar
   */
  componentDidUpdate() {
    // re-initialize dropdown content when it  changes
    $('.dropdown-button').dropdown({
      belowOrigin: true,
      alignment: 'left',
    });
  }

  signInRedirect = {
    pathname: '/signin',
    state: { modal: true, previousLocation: this.props.location.pathname },
  };

  renderUserImage = () => this.props.user.data.imageUrl ?
    <img src={this.props.user.data.imageUrl} alt="" width="38" height="38" className="circle" /> :
    <i style={{ fontSize: '3rem' }} className="large material-icons">account_circle</i>;

  renderRightContent = () => this.props.user.data.token ?
    <li>
      <a className="dropdown-button" data-beloworigin="true" data-activates="dropdown">
        {this.renderUserImage()}
        <span className="black-text">{this.props.user.data.username}</span>
        <i className="material-icons">arrow_drop_down</i>
      </a>
    </li> :
    <li>
      <Link to={this.signInRedirect}>Sign In</Link>
    </li>;

  /**
   * @returns {JSX.Element} Navbar component
   *
   * @memberOf NavBar
   */
  render() {
    return (
      <div id="navbar-component" className="navbar-fixed">
        <nav className="white">
          <div className="nav-wrapper container">
            <Link to="/catalog" className="brand-logo">
              <img src={Logo} alt="navbar logo" />
              <h5>MoreRecipes</h5>
            </Link>
            <ul className="right">
              {this.renderRightContent()}
            </ul>

            <ul id="dropdown" className="dropdown-content">
              <li>
                <Link to="/user"><i className="material-icons">person</i>Profile</Link>
                <a onClick={() => {
                  localStorage.removeItem('user');
                  this.props.signOutUser();
                }}
                >
                  <i className="material-icons">exit_to_app</i>Sign Out
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

NavBar.propTypes = {
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
