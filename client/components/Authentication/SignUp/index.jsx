import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import validator from 'validator';

import { userAuthRequest } from '../../../actions/user';

class SignUp extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    fieldError: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  }

  // eslint-disable-next-line
  onChange = (e) => {
    const inputFieldName = e.target.name;
    let inputFieldValue;

    switch (inputFieldName) {
      case 'username':
        inputFieldValue = e.target.value.trim().toLowerCase();
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
        inputFieldValue = e.target.value;
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
        inputFieldValue = e.target.value;
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
        inputFieldValue = e.target.value;
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

  onSubmit = (e) => {
    e.preventDefault();
    if (
      !(Object.values(this.state.fieldError).every(val => val.length === 0))
    ) {
      return;
    }
    const userData = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      firstName: 'firstname',
      lastName: 'lastname',
    };
    this.props.userAuthRequest(userData, 'signup');
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    const { authError, authRequestInitiated } = nextProps.user;
    if (authRequestInitiated) {
      return;
    }
    if (authError) {
      const { error } = authError;
      // eslint-disable-next-line
      error.includes('username') ? 
        this.setState({ fieldError: { ...this.state.fieldError, username: 'username has been taken' } }) :
        this.setState({ fieldError: { ...this.state.fieldError, email: 'this email is already registered' } })
    } else {
      this.props.history.replace(this.props.location.state.previousLocation);
    }
  }

  render() {
    const {
      username, email, password, passwordConfirm, fieldError,
    } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
          <h5 style={{ fontFamily: 'Raleway' }}>Create an account</h5>
        </div>

        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="username">Username</label>
          <input value={username} required style={{ marginBottom: '0' }} name="username" id="username" type="text" onChange={this.onChange} />
          {fieldError.username.length > 0 && <span style={{ color: 'red' }}>{fieldError.username}</span>}
        </div>

        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Email</label>
          <input value={email} required style={{ marginBottom: '0' }} name="email" id="email" type="email" onChange={this.onChange} />
          {fieldError.email.length > 0 && <span style={{ color: 'red' }}>{fieldError.email}</span>}
        </div>
      
        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="password">Password</label>
          <input value={password} required style={{ marginBottom: '0' }} name="password" id="password" type="password" onChange={this.onChange} />
          {fieldError.password.length > 0 && <span style={{ color: 'red' }}>{fieldError.password}</span>}
        </div>

        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input value={passwordConfirm} required style={{ marginBottom: '0' }} name="passwordConfirm" id="passwordConfirm" onChange={this.onChange} type="password" />
          {fieldError.passwordConfirm.length > 0 && <span style={{ color: 'red' }}>{fieldError.passwordConfirm}</span>}
        </div>

        <button id="download-button" className="btn-large waves-effect waves-light" style={{ textTransform: 'none', display: 'block', backgroundColor: '#444', width: '100%' }}>
          Sign Up
        </button>
        {this.props.user.authRequestInitiated && <div className="progress"><div className="indeterminate" /></div>}
        <p style={{ textAlign: 'center' }}>Already Have an Account? <Link to={{ pathname: '/signin', state: this.props.location.state }}>Sign In</Link> </p>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userAuthRequest: (authData, authType) => dispatch(userAuthRequest(authData, authType)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
