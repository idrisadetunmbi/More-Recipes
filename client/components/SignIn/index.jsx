import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import validator from 'validator';
import PropTypes from 'prop-types';

import { userAuthRequest } from '../../actions/user';
import { showToast } from '../../utils';
import { InputField } from '../reusables';

/**
 * @class SignIn
 * @extends {React.Component}
 */
export class SignIn extends React.Component {
  state = {
    username: '',
    password: '',
    fieldError: {
      username: '',
      password: '',
    },
  }

  /**
   * @param {any} nextProps
   *
   * @returns {void}
   * @memberOf SignIn
   */
  componentWillReceiveProps(nextProps) {
    const { userRequestInitiated, userRequestError } = nextProps.user;
    if (userRequestInitiated) {
      return;
    }
    if (userRequestError) {
      const { error } = userRequestError;
      this.setState({ authError: error });
    } else {
      showToast('You are now signed in!!!');
      this.props.history.replace(this.props.location.state.previousLocation);
    }
  }

  /**
   * @param {Object} event - DOM event
   *
   * @returns {void}
   * @memberOf SignIn
   */
  onChange = (event) => {
    this.setState({ authError: null });
    const inputFieldName = event.target.name;
    let inputFieldValue;

    switch (inputFieldName) {
      case 'username':
        inputFieldValue = event.target.value.trim().toLowerCase();
        this.setState({ [inputFieldName]: inputFieldValue });
        if (
          !validator.isLength(inputFieldValue, { min: 5, max: 15 }) ||
          !validator.isAlphanumeric(inputFieldValue)
        ) {
          this.setState({
            fieldError: {
              ...this.state.fieldError,
              username: 'username must have at least five alphanumeric characters',
            },
          });
        } else {
          this.setState({
            fieldError: {
              ...this.state.fieldError,
              username: '',
            },
          });
        }
        break;
      case 'password':
        inputFieldValue = event.target.value;
        this.setState({ [inputFieldName]: inputFieldValue });
        if (!validator.isLength(inputFieldValue, { min: 6, max: 25 })) {
          this.setState({
            fieldError: {
              ...this.state.fieldError,
              password: 'password field requires at least six characters',
            },
          });
        } else {
          this.setState({
            fieldError: {
              ...this.state.fieldError,
              password: '',
            },
          });
        }
        break;
      default:
        break;
    }
  }

  /**
   * @param {Object} event - DOM event
   *
   * @returns {void}
   * @memberOf SignIn
   */
  onSubmit = (event) => {
    event.preventDefault();
    if (
      !(Object.values(this.state.fieldError).every(val => val.length === 0))
    ) {
      return;
    }
    const userData = {
      username: this.state.username,
      password: this.state.password,
    };
    this.props.signInUser(userData);
  }

  /**
   * @returns {Object} Signup form NODE
   *
   * @memberOf SignIn
   */
  render() {
    const {
      username, password, fieldError, authError,
    } = this.state;

    return (
      <form onSubmit={this.onSubmit} className="auth-component">
        <div>
          <h5>Sign In To Your Account</h5>
        </div>

        <InputField
          label="username"
          value={username}
          required
          onChange={this.onChange}
          type="text"
          fieldError={fieldError.username}
        />

        <InputField
          label="password"
          value={password}
          type="password"
          onChange={this.onChange}
          required
          fieldError={fieldError.password}
        />

        {authError && <span style={{ color: 'red' }}>{authError}</span>}
        <button id="form-submit" className="btn-large waves-effect waves-light">
          Sign In
        </button>
        {this.props.user.userRequestInitiated &&
          <div className="progress"><div className="indeterminate" /></div>}
        <p>Dont Have an Account?&nbsp;
          <Link to={{ pathname: '/signup', state: this.props.location.state }}>
            Sign Up
          </Link>
        </p>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  signInUser: authData =>
    dispatch(userAuthRequest(authData, 'signin')),
});

SignIn.propTypes = {
  user: PropTypes.shape().isRequired,
  signInUser: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
