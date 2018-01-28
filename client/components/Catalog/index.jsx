import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import RecipeList from '../RecipeList';
import './index.scss';


const Catalog = props => (
  <div id="catalog-component">
    <div id="search-section" className="row">
      <div className="col l3 m4 s12">
        <button className="btn-large">Categories</button>
      </div>
      <div className="col l8 m8 s12">
        <input placeholder="Search Recipe" type="text" />
        <a href="#" className="btn-large">
          <i className="material-icons medium">search</i>
        </a>
      </div>
    </div>

    <div id="main-divider" className="divider" />

    <div className="row">
      <div className="col l3" id="suggestion-section">
        <h5>Today{'\''}s Combo</h5>
        <div className="divider" />
        <div className="recipe">
          <div className="card">
            <div className="card-image">
              <img alt="" src="images/sample_recipes/recipe0116-xl-farro-with-vinegar-glazed-sweet-potato-and-apples.jpg" />
            </div>
            <div className="card-content">
              <span className="card-title">Farrow with vinegar, glazed sweet potato and apples</span>
              <p>I am a very simple card. I am good at containing small bits of information.
                I am convenient because I require little markup to use effectively.
              </p>
            </div>
            <div className="card-action">
              <a href="#">This is a link</a>
            </div>
          </div>
        </div>
      </div>

      <div className="col l9 s12">
        <h5>Featured Recipes</h5>
        <div className="divider" id="gallery-before" />
        <RecipeList
          recipes={props.recipes.recipes}
          isLoadingRecipes={props.recipes.isFetching}
          error={props.recipes.error}
          style={{ width: '97%', marginLeft: '-0.6em' }}
          gridStyle="l4 s12 m6"
        />
      </div>
    </div>

    <div className="fixed-action-btn">
      <a
        className="btn-floating btn-large"
        onClick={() => {
        if (!props.user.data.token) {
          redirectToSignIn(props.history);
          return;
        }
        props.history.push('/recipes/create', {
          modal: true,
          previousLocation: props.history.location.pathname,
        });
      }}
      >
        <i className="material-icons">add</i>
      </a>
    </div>
  </div>
);

const redirectToSignIn = (history) => {
  history.push('/signin', {
    modal: true,
    previousLocation: history.location.pathname,
  });
};

const mapStateToProps = state =>
  ({
    user: state.user,
    recipes: state.recipes,
  });

export default connect(mapStateToProps)(Catalog);
