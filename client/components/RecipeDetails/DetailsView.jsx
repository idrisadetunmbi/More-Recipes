import React from 'react';
import PropTypes from 'prop-types';
import UserIcon from './avatar_img.png';
import { LoaderWithComponent } from '../reusables';

const DetailsView = (props) => {
  const { userVoteStatuses } = props;
  const userUpvoted = userVoteStatuses && userVoteStatuses.upvoted;
  const userDownvoted = userVoteStatuses && userVoteStatuses.downvoted;
  const userFavorited = userVoteStatuses && userVoteStatuses.favorited;

  const userIsSignedIn = () => {
    const { user, history } = props;
    // if user is not signed in, redirect user to sign in
    if (!user.token) {
      history.push('/signin', {
        modal: true,
        previousLocation: history.location.pathname,
      });
      return false;
    }
    return true;
  };

  const { recipe, user } = props;
  return (
    <div className="recipe-details-component">
      <div className="container-section container">
        <div className="row" id="recipe-info">
          {/* recipe images and action buttons start */}
          <div className="col s12 l4 images-section">
            <h5 className="title">{recipe.title}</h5>
            <div className="divider" />
            {/* recipe author section */}
            <div id="recipe-author-section">
              {
                recipe.author.imageUrl ?
                  <img
                    src={recipe.author.imageUrl}
                    alt=""
                    className="responsive-img circle"
                  /> :
                  <i className="material-icons">account_circle</i>
              }
              <div>
                <span>Authored by</span>
                <p>
                  {props.userOwnsRecipe() ? 'You' : recipe.author.username}
                </p>
              </div>
            </div>
            <div>
              <div>
                <div className="recipe-main-img">
                  <img src={`${recipe.images[0]}`} alt="" />
                </div>
                <div id="thumbnails-row" className="row">
                  {
                    // TODO: replace image sources
                    (recipe.images.slice(1).map((image, i) =>
                      (<img
                        style={{ marginRight: `${!(i % 2) && '2%'}` }}
                        className="col s6 thumbnails"
                        src={image}
                        alt=""
                      />))
                    )
                  }
                </div>
              </div>

              {/* TODO: wire actions to onClicks of the action buttons */}
              <div>
                <div className="vote-actions">
                  <a
                    style={{ marginLeft: '0' }}
                    className={`btn waves-ripple ${userUpvoted && 'checked'}`}
                    disabled={props.userOwnsRecipe()}
                    onClick={() => userIsSignedIn() &&
                      props.recipeVoteAction('upvote', recipe.id)}
                  >
                    <i className="material-icons">thumb_up</i>
                    <span>{recipe.upvotes}</span>
                  </a>
                  <a
                    className={`btn waves-ripple ${userDownvoted && 'checked'}`}
                    disabled={props.userOwnsRecipe()}
                    onClick={() => userIsSignedIn() &&
                      props.recipeVoteAction('downvote', recipe.id)}
                  >
                    <i className="material-icons">thumb_down</i>
                    <span>{recipe.downvotes}</span>
                  </a>
                  <a
                    className={`btn waves-ripple ${userFavorited && 'checked'}`}
                    disabled={props.userOwnsRecipe()}
                    onClick={() => userIsSignedIn() &&
                      props.recipeVoteAction('favorite', recipe.id)}
                  >
                    <i className="material-icons">favorite</i>
                    <span>{recipe.favorites}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* recipe images and action buttons end */}

          <div className="col s12 offset-l1 l6 description-section">
            <div>
              <h5>Description</h5>
              <p>{recipe.description}</p>
            </div>
            <div className="divider" />
            <div className="ingredients">
              <h5>Ingredients</h5>
              <ul>
                {
                  recipe.ingredients.split('\n')
                    .map((ingredient, i) =>
                      (
                        <li>
                          <p>
                            <i className="material-icons">chevron_right</i>
                            {ingredient}
                          </p>
                        </li>
                      ))
                }
              </ul>
            </div>
            <div className="divider" />
            <div className="directions">
              <h5>Directions</h5>
              <ol>
                {
                  recipe.directions.split('\n').map(direction =>
                    <li><p>{direction}</p></li>)
                }
              </ol>
            </div>
          </div>
        </div>
        {/* recipe details end */}

        {/* review section */}
        <div className="divider" />
        <div id="review-section">
          <h5>Reviews</h5>
          <div className="row">
            <div id="review-form" className="col offset-m1 m10 s12 offset-l3 l6">
              <textarea
                value={props.reviewText}
                onChange={props.reviewOnChange}
                className="materialize-textarea"
                placeholder="Add a review"
              />
              <button onClick={props.reviewSubmit} className="btn btn-small">Submit</button>
            </div>

            {
              <LoaderWithComponent
                showLoader={!props.reviews}
                component={
                  props.reviews && props.reviews.length ?
                    props.reviews.map(review => (
                      <Review review={review} key={review.id} />)) :
                    <p id="no-review-text" className="col l6 offset-l3">
                      This Recipe currently has no reviews
                    </p>
                }
              />
            }
          </div>
        </div>
      </div>

      {
        user.token && props.userOwnsRecipe() &&
        (
          <div className="fixed-action-btn">
            <a className="btn-floating btn-large">
              <i className="large material-icons">menu</i>
            </a>
            <ul>
              <li>
                <a
                  onClick={() => props.recipeAction('delete', recipe.id)}
                  className="btn-floating red"
                >
                  <i className="material-icons">delete</i>
                </a>
              </li>
              <li>
                <a
                  onClick={props.toggleViewMode}
                  className="btn-floating yellow darken-1"
                >
                  <i className="material-icons">edit</i>
                </a>
              </li>
            </ul>
          </div>
        )
      }
    </div>
  );
};

const Review = (props) => {
  const reviewer = props.review.user;
  const date = new Date(props.review.createdAt);
  const month = date.toLocaleString('en-us', { month: 'short' });
  const day = date.getDate();

  return (
    <div className="review col offset-m1 m10 s12 offset-l3 l6">
      <img
        className="circle"
        src={reviewer.imageUrl || UserIcon}
        width="35"
        height="35"
        alt="reviewers icon"
      />
      <div className="review-details">
        <span className="reviewers-name">{reviewer.username}</span>
        <span className="date">{`${month} ${day}`}</span>
      </div>
      <div className="divider" />
      <p className="review-text">
        {props.review.content}
      </p>
    </div>
  );
};

DetailsView.propTypes = {
  recipe: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
  recipeAction: PropTypes.func.isRequired,
  recipeVoteAction: PropTypes.func.isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object),
  reviewText: PropTypes.string.isRequired,
  reviewOnChange: PropTypes.func.isRequired,
  reviewSubmit: PropTypes.func.isRequired,
  toggleViewMode: PropTypes.func.isRequired,
  userVoteStatuses: PropTypes.shape(),
  userOwnsRecipe: PropTypes.func.isRequired,
};

DetailsView.defaultProps = {
  reviews: undefined,
  userVoteStatuses: undefined,
};

Review.propTypes = {
  review: PropTypes.shape().isRequired,
};

export default DetailsView;
