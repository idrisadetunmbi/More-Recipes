import React from 'react';
import Logo from './logo.jpg';

const SignIn = ({ props }) => (
  <div className="container">
    <div className="row">
      <div className="col l5 offset-l4">
        {/* <div id="logo-container" className="center">
          <a href="./" className="brand-logo">
            <img style={{ marginRight: '0.8em', height: '60px', verticalAlign: 'middle' }} src={Logo} alt="" />
            <span style={{ fontSize: '1.7em', fontFamily: 'Lato', verticalAlign: 'middle', color: '#444', fontStyle: 'italic', fontWeight: '700'}}>More-Recipes</span>  
          </a>
        </div> */}
        
        <div className="divider" />
        
        <form>
          <div style={{ marginTop: '3rem' }}>
            <h5 style={{ fontFamily: 'Raleway' }}>Create an account</h5>
          </div>

          <div className="input-field">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" className="validate" />
          </div>

          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" className="validate" />
          </div>
        
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" className="validate" />
          </div>

          <div className="input-field col s12">
            <label htmlFor="password_confirm">Confirm Password</label>
            <input id="password_confirm" type="password" className="validate" />
          </div>

          <a href="./" id="download-button" className="btn-large waves-effect waves-light" style={{ textTransform:'none', display: 'block', marginLeft: '8px', marginRight: '8px', backgroundColor: '#444' }}>Sign Up</a>
          <p style={{ textAlign: 'center' }}>Already Have an Account? <a href="#!">Sign In</a> </p>
        </form>
      </div>
    </div>
  </div>
);

export default SignIn;
