import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import SignIn from './SignIn';
import SignUp from './SignUp';

export default class Authentication extends React.Component {

  componentDidMount() {
    document.addEventListener('keydown', this.escKeyPress);
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.escKeyPress);
  }
  
  back = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.location.state.previousLocation);
  };

  escKeyPress = (e) => {
    if (e.keyCode === 27) {
      this.back(e);
    }
  };

  render() {
    return (
      <div onClick={this.back}>
        <div className="modal-overlay" style={{ zIndex: 1002, display: 'block', opacity: 0.5 }} />
        <div
          className="modal open"
          style={{
            zIndex: 1003,
            display: 'block',
            opacity: 1,
            transform: 'scaleX(1)',
            top: '10%',
            maxHeight: '100% important',
        }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="container">
              <div className="row">
                <div className="">
                  <Switch>
                    <Route path="/signin" component={SignIn} />
                    <Route path="/signup" component={SignUp} />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
