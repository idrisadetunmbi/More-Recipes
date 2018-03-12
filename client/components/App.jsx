import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import LandingPage from './LandingPage';
import RecipeDetails from './RecipeDetails';
import NavBar from './NavBar';
import Modal from './Modal';
import Catalog from './Catalog';
import UserProfile from './UserProfile';
import NoMatch from './404';

import { fetchRecipes } from '../actions/recipes';

/**
 *
 *
 * @class App
 * @extends {Component}
 */
export class App extends Component {
  // eslint-disable-next-line
  previousLocation = this.props.location

  /**
   * @returns {void}
   * @memberOf App
   */
  componentWillMount() {
    this.props.fetchRecipes();
  }

  /**
   * @param {any} nextProps
   *
   * @returns {void}
   * @memberOf App
   */
  componentWillUpdate(nextProps) {
    localStorage.setItem('user', JSON.stringify(nextProps.userData));
    const { location } = this.props;
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  /**
   * @returns {void}
   *
   * @memberOf App
   */
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
          <Route
            exact
            path="/"
            render={() => (
              this.props.userData.token ? (
                <Redirect to="/catalog" />) :
                (<LandingPage />)
            )}
          />
          <Route path="/catalog" component={Catalog} />
          <Route path="/recipes/:recipeId" component={RecipeDetails} />
          <Route path="/user" component={UserProfile} />
          <Route component={NoMatch} />
        </Switch>
        {isModal ? <Route component={Modal} /> : null }
      </div>
    );
  }
}

App.propTypes = {
  fetchRecipes: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    token: PropTypes.string,
  }).isRequired,
};

export const mapStateToProps = state => ({
  userData: state.user.data,
});

export const mapDispatchToProps = dispatch => ({
  fetchRecipes: () => dispatch(fetchRecipes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
