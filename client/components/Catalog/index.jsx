import React from 'react';
import { Link } from 'react-router-dom';

import RecipeList from '../RecipeList';
import * as Styles from './styles';


const Catalog = props => (
  <div>
    <div
      id="search-section"
      className="row"
      style={Styles.searchInputEnclosingDiv}
    >
      <div className="col l3 m4 s12">
        <button className="btn-large">Categories</button>
      </div>
      <div className="col l8 m8 s12">
        <input
          placeholder="Search Recipe"
          style={Styles.searchInput}
          id="recipe-search"
          type="text"
        />
        <a href="#" style={{ marginLeft: '.6em', position: 'absolute' }} className="btn-large">
          <i className="material-icons medium" style={{ verticalAlign: 'middle', paddingTop: '0em' }}>search</i>
        </a>
      </div>
    </div>

    <div
      className="divider"
      style={{
        marginLeft: '3em', marginRight: '3em', marginTop: '0em', display: 'block',
      }}
    />

    <div className="row">
      <div className="col l3" style={{ padding: '3em', marginTop: '1em' }} id="suggestion-section">
        <h5 style={{
          fontFamily: 'Raleway', fontStyle: 'italic', marginBottom: '.5em', marginTop: '1em', fontSize: '1.5rem',
        }}
        >Today{'\''}s Combo
        </h5>
        <div className="divider" style={{ marginBottom: '2em' }} />
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
        <h5 style={{
          fontFamily: 'Raleway', fontStyle: 'italic', marginBottom: '1em', marginTop: '1em',
        }}
        >Featured Recipes
        </h5>
        <div className="divider" style={{ marginRight: '3em', marginTop: '2em', marginBottom: '1em' }} />
        <RecipeList style={{ width: '97%', marginLeft: '-0.6em' }} gridStyle="l4" />
      </div>
    </div>

    <div className="fixed-action-btn">
      <Link
        to={{ pathname: '/recipes/create', state: { modal: true, previousLocation: props.location.pathname } }}
        className="btn-floating btn-large"
      >
        <i className="material-icons">add</i>
      </Link>
    </div>
  </div>
);

export default Catalog;
