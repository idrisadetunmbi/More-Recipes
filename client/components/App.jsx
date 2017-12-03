import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import LandingPage from './LandingPage';
import RecipeDetails from './RecipeDetails';
import NavBar from './NavBar';
import Authentication from './Authentication';

export default class App extends Component {

  // eslint-disable-next-line
  previousLocation = this.props.location

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    );
    
    return (
      <div>
        <Route component={NavBar} />
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path="/" component={LandingPage} />
          <Route path="/recipes/:recipeId" component={RecipeDetails} />
        </Switch>
        {isModal ? <Route component={Authentication} /> : null }
      </div>
    );
  }
}
