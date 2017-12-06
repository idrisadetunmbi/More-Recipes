import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import LandingPage from './LandingPage';
import RecipeDetails from './RecipeDetails';
import NavBar from './NavBar';
import Authentication from './Authentication';
import Catalog from './Catalog';

import { fetchRecipes } from '../actions/recipes';

class App extends React.Component {

  // eslint-disable-next-line
  previousLocation = this.props.location

  componentWillMount() {
    this.props.fetchRecipes();
  }
  
  componentWillUpdate(nextProps) {
    localStorage.setItem('store', JSON.stringify(nextProps.state));
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
          <Route path="/catalog" component={Catalog} />
          <Route path="/recipes/:recipeId" component={RecipeDetails} />
        </Switch>
        {isModal ? <Route component={Authentication} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRecipes: () => dispatch(fetchRecipes()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
