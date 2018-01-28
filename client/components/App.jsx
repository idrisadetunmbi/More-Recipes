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

import { fetchRecipes } from '../actions/recipes';

class App extends Component {
  // eslint-disable-next-line
  previousLocation = this.props.location

  componentWillMount() {
    this.props.fetchRecipes();
  }

  componentDidMount() {
    $('.dropdown-button').dropdown({
      hover: true,
      belowOrigin: true,
      alignment: 'left',
      constrainWidth: false,
    });
  }

  componentWillUpdate(nextProps) {
    localStorage.setItem('user', JSON.stringify(nextProps.user));
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
          <Route
            exact
            path="/"
            render={() => (
              this.props.user.data.token ? (
                <Redirect to="/catalog" />) :
                (<LandingPage />)
            )}
          />
          <Route path="/catalog" component={Catalog} />
          <Route path="/recipes/:recipeId" component={RecipeDetails} />
          <Route path="/user" component={UserProfile} />
        </Switch>
        {isModal ? <Route component={Modal} /> : null }
      </div>
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
    fetchRecipes: () => dispatch(fetchRecipes()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
