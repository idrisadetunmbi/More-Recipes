import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import validator from 'validator';
import PropTypes from 'prop-types';
import { InputField } from '../reusables';

import { userAuthRequest } from '../../actions/user';
import { showToast } from '../../utils';
import './index.scss';

/**
 *
 *
 * @class SignUp
 * @extends {Component}
 */
export class SignUp extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    fieldError: {
      username: null,
      email: null,
      password: null,
      passwordConfirm: null,
    },
  }

  /**
   * @param {Object} nextProps
   *
   * @returns {void}
   * @memberOf SignUp
   */
  componentWillReceiveProps(nextProps) {
    const { userRequestInitiated, userRequestError } = nextProps.user;
    if (userRequestInitiated) {
      return;
    }
    if (userRequestError) {
      const { error } = userRequestError;
      // eslint-disable-next-line
      error.includes('username') ?
        this.setState({
          fieldError: {
            ...this.state.fieldError, username: 'username has been taken',
          },
        }) :
        this.setState({
          fieldError: {
            ...this.state.fieldError, email: 'this email is already registered',
          },
        });
    } else {
      showToast('You have signed up successfully!!!');
      this.props.history.replace(this.props.location.state.previousLocation);
    }
  }

  /**
   * @param {Object} event
   *
   * @returns {void}
   * @memberOf SignUp
   */
  onChange = (event) => {
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
      case 'email':
        inputFieldValue = event.target.value;
        this.setState({ [inputFieldName]: inputFieldValue });
        if (!validator.isEmail(inputFieldValue)) {
          this.setState({
            fieldError: {
              ...this.state.fieldError,
              email: 'please include a valid email',
            },
          });
        } else {
          this.setState({
            fieldError: {
              ...this.state.fieldError,
              email: '',
            },
          });
        }
        break;
      case 'passwordConfirm':
        inputFieldValue = event.target.value;
        this.setState({ [inputFieldName]: inputFieldValue });
        if (inputFieldValue !== this.state.password) {
          this.setState({
            fieldError: {
              ...this.state.fieldError,
              passwordConfirm: 'passwords do not match',
            },
          });
        } else {
          this.setState({
            fieldError: {
              ...this.state.fieldError,
              passwordConfirm: '',
            },
          });
        }
        break;
      default:
        break;
    }
  }

  /**
   * @param {Object} event
   *
   * @returns {void}
   * @memberOf SignUp
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
      email: this.state.email,
    };
    this.props.signUpUser(userData);
  }

  /**
   *
   * @returns {Object} sign up form element
   * @memberOf SignUp
   */
  render() {
    const {
      username, email, password, passwordConfirm, fieldError,
    } = this.state;

    return (
      <form onSubmit={this.onSubmit} className="auth-component">
        <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
          <h5>Create an account</h5>
        </div>

        <InputField
          label="username"
          value={username}
          type="text"
          onChange={this.onChange}
          required
          fieldError={fieldError.username}
        />

        <InputField
          label="email"
          value={email}
          required
          type="email"
          onChange={this.onChange}
          fieldError={fieldError.email}
        />

        <InputField
          label="password"
          value={password}
          required
          type="password"
          onChange={this.onChange}
          fieldError={fieldError.password}
        />

        <InputField
          label="passwordConfirm"
          value={passwordConfirm}
          required
          type="password"
          onChange={this.onChange}
          fieldError={fieldError.passwordConfirm}
        />

        <button id="form-submit" className="btn-large waves-effect waves-light">
          Sign Up
        </button>
        {this.props.user.userRequestInitiated && <div className="progress"><div className="indeterminate" /></div>}
        <p>Already Have an Account? <Link to={{ pathname: '/signin', state: this.props.location.state }}>Sign In</Link> </p>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  signUpUser: userData =>
    dispatch(userAuthRequest(userData, 'signup')),
});

SignUp.propTypes = {
  user: PropTypes.shape({
    userRequestInitiated: PropTypes.bool,
    userRequestError: PropTypes.object,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape().isRequired,
  signUpUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
