import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RecipeList from '../RecipeList';
import BannerBackground from './banner_background.jpg';
import DiscoverIcon from './discover.png';
import ReviewIcon from './review_icon.png';
import './index.scss';

const LandingPage = props => (
  <div id="landing-page-component">
    <div id="index-banner" className="parallax-container">
      <div className="section no-pad-bot">
        <div className="container">
          <h1 className="header center grey-text text-darken-4">More Recipes</h1>
          <div className="center">
            <h5 className="header col blue-grey-text text-darken-4 s12">We Know You Love to Try New things.... Especially New Tastes</h5>
          </div>
          <div className="center">
            <a id="btn-browse-catalog" className="btn-large waves-effect waves-light grey darken-4 lighten-1">
              Browse Catalog
            </a>
          </div>
        </div>
      </div>
      <div className="parallax"><img src={BannerBackground} alt="Unsplashed background img 1" /></div>
    </div>
    {/* Banner Section End */}

    {/* About Section Start */}
    <div className="container">
      <div className="section">
        <div id="" className="row">

          <div className="col s12 m4">
            <div className="icon-block">
              <h2 className="center brown-text">
                <img src={DiscoverIcon} className="responsive-img" alt="" />
              </h2>
              <h5 className="center">Discover Exciting Recipes</h5>

              <p className="light">Browse through a rich base of interesting and exciting recipes from lovers of new tastes like you</p>
            </div>
          </div>

          <div className="col s12 m4">
            <div className="icon-block">
              <h2 className="center"><i className="material-icons">share</i></h2>
              <h5 className="center">Share Your Combinations</h5>
              <p className="light">You love discovering new tastes and exciting combinations - Share sensational discoveries with other taste lovers and get exciting reviews that drives you to do more</p>
            </div>
          </div>

          <div className="col s12 m4">
            <div className="icon-block">
              <h2 className="center brown-text">
                <img src={ReviewIcon} className="responsive-img" style={{ height: '50px' }} alt="" />
              </h2>
              <h5 className="center">Review And Improve</h5>
              <p className="light">Rate, assess, react, suggest....... and recipes can even be transformed into stimulating adventures.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* About Section End */}

    {/* Recipe gallery start */}
    <div id="recipe-gallery-section" className="divider" />
    <div className="section">
      <h5>Featured Recipes</h5>
    </div>
    <RecipeList
      recipes={props.recipes.recipes.slice(0, 8)}
      isLoadingRecipes={props.recipes.requestInitiated}
      error={props.recipes.requestError}
      style={{ width: '90%' }}
      gridStyle="l3 s12 m6"
    />
    <div className="center">
      <Link to="/catalog" className="btn-large waves-effect waves-light grey darken-4 lighten-1">view entire catalog</Link>
    </div>

  </div>
);

const mapStateToProps = state => ({
  recipes: state.recipes,
});

LandingPage.propTypes = {
  recipes: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(LandingPage);
