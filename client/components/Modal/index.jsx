import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignIn from '../SignIn';
import SignUp from '../SignUp';
import CreateRecipe from '../CreateRecipe';
import './index.scss';

export default class Modal extends React.Component {
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
    // if esc key is pressed
    if (e.keyCode === 27) {
      this.back(e);
    }
  };

  render() {
    return (
      <div onClick={this.back} id="modal-component">
        <div className="modal-overlay" />
        <div className="modal open">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="container">
              <div className="row">
                <div className="">
                  <Switch>
                    <Route path="/signin" component={SignIn} />
                    <Route path="/signup" component={SignUp} />
                    <Route path="/recipes/create" component={CreateRecipe} />
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
