import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import validator from 'validator';

import { userAuthRequest } from '../../actions/user';
import { showToast } from '../../utils';

class SignIn extends React.Component {
  state = {
    username: '',
    password: '',
    fieldError: {
      username: '',
      password: '',
    },
  }

  // eslint-disable-next-line
  onChange = (e) => {
    this.setState({ authError: null });
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
    };
    this.props.userAuthRequest(userData, 'signin');
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    const { userRequestInitiated, userRequestError } = nextProps.user;
    if (userRequestInitiated) {
      return;
    }
    if (userRequestError) {
      const { error } = userRequestError;
      // eslint-disable-next-line
      this.setState({ authError: error });
    } else {
      showToast('You are now signed in!!!');
      this.props.history.replace(this.props.location.state.previousLocation);
    }
  }

  render() {
    const { username, password, fieldError, authError } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
          <h5 style={{ fontFamily: 'Raleway' }}>Sign In To Your Account</h5>
        </div>

        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="username">Username</label>
          <input value={username} required style={{ marginBottom: '0' }} name="username" id="username" type="text" onChange={this.onChange} />
          {fieldError.username.length > 0 && <span style={{ color: 'red' }}>{fieldError.username}</span>}
        </div>
      
        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="password">Password</label>
          <input value={password} required style={{ marginBottom: '0' }} name="password" id="password" type="password" onChange={this.onChange} />
          {fieldError.password.length > 0 && <span style={{ color: 'red' }}>{fieldError.password}</span>}
        </div>

        {authError && <span style={{ color: 'red' }}>{authError}</span>}
        <button id="download-button" className="btn-large waves-effect waves-light" style={{ textTransform: 'none', display: 'block', backgroundColor: '#444', width: '100%' }}>Sign In</button>
        {this.props.user.userRequestInitiated && <div className="progress"><div className="indeterminate" /></div>}
        <p style={{ textAlign: 'center' }}>Dont Have an Account? <Link to={{pathname: '/signup', state: this.props.location.state }}>Sign Up</Link> </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
