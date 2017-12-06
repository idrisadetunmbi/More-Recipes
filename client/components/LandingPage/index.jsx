import React from 'react';
import { Link } from 'react-router-dom';

import RecipeList from '../RecipeList';
import BannerBackground from './banner_background.jpg';
import DiscoverIcon from './discover.png';
import ReviewIcon from './review_icon.png';
import './index.css';

const LandingPage = () => (
  <div>
    <div id="index-banner" className="parallax-container">
      <div className="section no-pad-bot">
        <div className="container">
          <h1 className="header center grey-text text-darken-4" style={{ fontFamily: 'Crete Round' }}>More Recipes</h1>
          <div className="center">
            <h5 className="header col blue-grey-text text-darken-4 s12" style={{ fontFamily: 'Raleway', fontStyle: 'italic' }}>We Know You Love to Try New things.... Especially New Tastes</h5>
          </div>
          <div className="center">
            <a id="btn-browse-catalog" style={{ marginTop: '4em' }} className="btn-large waves-effect waves-light grey darken-4 lighten-1">
              Browse Catalog
            </a>
          </div>
        </div>
      </div>
      <div className="parallax"><img style={{ display: 'block' }} src={BannerBackground} alt="Unsplashed background img 1" /></div>
    </div>
    {/* Banner Section End */}

    {/* About Section Start */}
    <div className="container">
      <div className="section">
        <div id="" className="row">

          <div className="col s12 m4">
            <div className="icon-block">
              <h2 className="center brown-text">
                <img src={DiscoverIcon} className="responsive-img" style={{ height: '50px', width: '50px' }} alt="" />
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
    <div className="divider" style={{ marginLeft: '3em', marginRight: '3em' }} />
    <div className="section">
      <h5 style={{ fontFamily: 'Raleway', fontStyle: 'italic', textAlign: 'center' }}>Featured Recipes</h5>
    </div>
    <RecipeList style={{ width: '90%' }} gridStyle="l3" />
    <div className="center" style={{ marginTop: '6em' }}>
      <Link to="/catalog" className="btn-large waves-effect waves-light grey darken-4 lighten-1">view entire catalog</Link>
    </div>

  </div>
);

export default LandingPage;
