import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import './index.css';

// TODO: add more props as might be required
const RecipeDetails = ({ recipe = {
  title: 'A great recipe',
  favorites: 10,
  upvotes: 21,
  description: 'A great recipe',
  directions: [
    'A great recipe'
  ],
  ingredients: [
    1,2,3
  ]
} }) => (
  <div>
    <div className="container-section container">
      <div className="row" id="recipe-info">
        {/* recipe images and action buttons start */}
        <div className="col s12 l4 images-section">
          <h5 className="title">{recipe.title}</h5>
          <div className="divider" style={{}} />
          {/* recipe author section */}
          <div>
            {/* <div><span style={{ fontStyle: 'italic', verticalAlign: 'top' }} >Recipe by</span></div> */}
            <i style={{ fontSize: '4rem', margin: '1rem', color: '#444' }} className="material-icons">account_circle</i>
            <p style={{ display: 'inline-block', verticalAlign: 'top' }} >{recipe.author.username}</p>
          </div>
          {/* <div className="divider" style={{}} /> */}
          <div>
            <div>
              {/* TODO: replace image source */}
              <img src="" alt={`${recipe.title} - main image`} style={{ marginTop: '1rem', width: '100%', padding: '0rem', minHeight: '250px' }} />

              <div className="thumbnails row">
                {
                  // TODO: replace image sources
                  (new Array(6)).fill(1).map((image, index) =>
                    <img className="col s6 thumbnails" src="" alt={`thumbnail - ${index}`} />)
                }
              </div>
            </div>

            {/* TODO: wire actions to onClicks of the action buttons */}
            <div>
              <div className="vote-actions">
                <a style={{ marginLeft: '0' }} href="." className="btn waves-ripple"><i className="material-icons">thumb_up</i><span>{recipe.upvotes}</span></a>
                <a href="." className="btn waves-ripple"><i className="material-icons">favorite</i><span>{recipe.favorites}</span></a>
              </div>

              <div id="favorites-icon" style={{ marginLeft: '0', marginTop: '2rem' }}>
                <p style={{ WebkitMarginAfter: '0', fontSize: '18px', marginLeft: '.2rem' }}>Rate and Review</p>
                <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
              </div>
            </div>
          </div>
        </div>
        {/* recipe images and action buttons end */}

        <div style={{ marginLeft: '3rem', marginTop: '3rem' }} className="col s12 l7 description-section">
          <div>
            <h5>Description</h5>
            <p>{recipe.description}</p>
          </div>
          <div className="divider" />
          <div className="ingredients">
            <h5>Ingredients</h5>
            <ul>
              {
                recipe.ingredients.split('.').map((ingredient, i) => <li><i className="material-icons">chevron_right</i>{ingredient}</li>)
              }
            </ul>
          </div>
          <div className="divider" />
          <div className="directions">
            <h5>Directions</h5>
            <ol>
              {
                recipe.directions.split('.').map((direction, i) => <li><p>{direction}</p></li>)
              }
            </ol>
          </div>
        </div>
      </div>
      {/* recipe details end */}

      {/* review section */}
      <div className="divider" />
      <div id="review-section">
        <div className="row">
          <h5 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem', fontFamily: 'Raleway', fontStyle: 'normal' }} >Reviews</h5>
          {/* Reviews goes here */}
        </div>
      </div>
    </div>
  </div>


);

// RecipeDetails.propTypes = {
//   recipe: PropTypes.objectOf().isRequired,
// };

const mapStateToProps = (state, ownProps) => {
  return {
    recipe: state.recipes.recipes.filter(recipe => recipe.id === ownProps.match.params.recipeId)[0],
  };
};

export default connect(mapStateToProps)(RecipeDetails);
