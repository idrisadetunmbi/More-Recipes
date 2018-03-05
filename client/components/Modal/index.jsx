import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import SignIn from '../SignIn';
import SignUp from '../SignUp';
import CreateRecipe from '../CreateRecipe';
import './index.scss';

/**
 * @class Modal
 * @extends {React.Component}
 */
export default class Modal extends Component {
  /**
   * @returns {void}
   * @memberOf Modal
   */
  componentDidMount() {
    document.addEventListener('keydown', this.escKeyPress);
    document.body.style.overflow = 'hidden';
  }

  /**
   * @returns {void}
   * @memberOf Modal
   */
  componentWillUnmount() {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.escKeyPress);
  }

  /**
   * @param {Object} event - DOM event object
   *
   * @returns {void}
   * @memberOf Modal
   */
  back = (event) => {
    event.stopPropagation();
    this.props.history.replace(this.props.location.state.previousLocation);
  };

  /**
   * @param {Object} event - DOM event object
   *
   * @returns {void}
   * @memberOf Modal
   */
  escKeyPress = (event) => {
    // if esc key is pressed
    if (event.keyCode === 27) {
      this.back(event);
    }
  };

  /**
   * @returns {JSX.Element} - Modal
   * @memberOf Modal
   */
  render() {
    return (
      <div onClick={this.back} id="modal-component">
        <div className="modal-overlay" />
        <div className="modal open">
          <div className="modal-content" onClick={event => event.stopPropagation()}>
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

Modal.propTypes = {
  history: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};
