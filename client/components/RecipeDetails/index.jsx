import React from 'react';
import { connect } from 'react-redux';
import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';

import { recipeAction, recipeVoteAction, fetchRecipe } from '../../actions/recipes';
import { fetchRecipeReviews, postRecipeReview } from '../../actions/reviews';
import { fetchRecipeVoteStatuses } from '../../actions/user';
import './index.scss';
import DetailsView from './DetailsView';
import EditView from './EditView';
import { showToast  } from '../../utils';


/**
 *
 *
 * @class RecipeDetails
 * @extends {React.Component}
 */
class RecipeDetails extends React.Component {
  state = {
    isDetailsMode: true,
    reviewText: '',
    recipeNotFound: false,
  }

  /**
   *
   * @returns {void}
   * @memberOf RecipeDetails
   */
  componentDidMount() {
    const { user, recipe } = this.props;
    if (!recipe) {
      fetchRecipe(this.props.match.params.recipeId);
      return;
    }
    this.props.fetchRecipeReviews(recipe.id);
    // if user is signed in and does not own recipe
    if (user.token && !this.userOwnsRecipe()) {
      this.props.fetchUserVoteStatuses(recipe.id);
    }
  }

  /**
   * @param {any} nextProps
   *
   * @returns {void}
   * @memberOf RecipeDetails
   */
  componentWillReceiveProps(nextProps) {
    // if recipe has been updated and view mode is in edit mode
    if (
      !deepEqual(nextProps.recipe, this.props.recipe) &&
      !this.state.isDetailsMode
    ) {
      showToast('Recipe has been successfully updated');
      this.toggleViewMode();
    }
    // reset review text input box when a new review is posted
    if (!deepEqual(nextProps.reviews, this.props.reviews)) {
      this.setState({
        reviewText: '',
      });
    }
    if (nextProps.recipeNotFound) {
      this.setState({ recipeNotFound: true });
    }
    // if recipe has been loaded but reviews have not been loaded, load reviews
    if (!nextProps.reviews && nextProps.recipe) {
      this.props.fetchRecipeReviews(nextProps.recipe.id);
    }
  }

  /**
   * @param {Object} event
   *
   * @returns {void}
   * @memberOf RecipeDetails
   */
  reviewOnChange = (event) => {
    this.setState({
      reviewText: event.target.value,
    });
  }

  /**
   * @returns {void}
   * @memberOf RecipeDetails
   */
  reviewSubmit = () => {
    const { reviewText } = this.state;
    const { user, history } = this.props;
    if (reviewText.length === 0) {
      return;
    }
    if (!user.token) {
      history.push('/signin', {
        modal: true,
        previousLocation: history.location.pathname,
      });
      return;
    }
    const reviewData = {
      content: reviewText,
      rating: 5,
    };
    this.props.postRecipeReview(this.props.recipe.id, reviewData);
  }

  /**
   *
   *
   * @returns {void}
   * @memberOf RecipeDetails
   */
  toggleViewMode = () => {
    this.setState({ isDetailsMode: !this.state.isDetailsMode });
  }

  /**
   * checks if currently signed in user owns the recipe
   * @returns {Boolean} current user owns recipe
   * @memberOf RecipeDetails
   */
  userOwnsRecipe = () =>
    this.props.user.token &&
      this.props.recipe.authorId === this.props.user.id

  /**
   * @returns {void}
   * @memberOf RecipeDetails
   */
  render() {
    if (this.state.recipeNotFound) {
      return (<p>Recipe Does Not Exist</p>);
    }
    if (!this.props.recipe) {
      return (<p>Loading recipe...</p>);
    }
    return (this.state.isDetailsMode ?
      <DetailsView
        {...this.props}
        toggleViewMode={this.toggleViewMode}
        reviewText={this.state.reviewText}
        reviewOnChange={this.reviewOnChange}
        reviewSubmit={this.reviewSubmit}
        userOwnsRecipe={this.userOwnsRecipe}
      /> :
      <EditView {...this.props} toggleViewMode={this.toggleViewMode} />
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  recipe: state.recipes.recipes
    .filter(recipe => recipe.id === ownProps.match.params.recipeId)[0],

  user: state.user.data,

  reviews: state.reviews[ownProps.match.params.recipeId],

  userVoteStatuses: state.user
    .recipesVoteStatuses[ownProps.match.params.recipeId],

  recipeNotFound: state.recipes.requestError,
});

const mapDispatchToProps = dispatch => ({
  recipeAction: (actionType, recipeData) =>
    dispatch(recipeAction(actionType, recipeData)),

  fetchRecipeReviews: recipeId => dispatch(fetchRecipeReviews(recipeId)),

  postRecipeReview: (recipeId, reviewData) =>
    dispatch(postRecipeReview(recipeId, reviewData)),

  recipeVoteAction: (actionType, recipeId) =>
    dispatch(recipeVoteAction(actionType, recipeId)),

  fetchUserVoteStatuses: recipeId =>
    dispatch(fetchRecipeVoteStatuses(recipeId)),

  fetchRecipe: recipeId => dispatch(fetchRecipe(recipeId)),
});

RecipeDetails.propTypes = {
  user: PropTypes.shape().isRequired,
  recipe: PropTypes.shape(),
  fetchRecipeReviews: PropTypes.func.isRequired,
  postRecipeReview: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object),
  recipeNotFound: PropTypes.bool,
  fetchUserVoteStatuses: PropTypes.func.isRequired,
  match: PropTypes.shape().isRequired,
};

RecipeDetails.defaultProps = {
  recipe: undefined,
  reviews: undefined,
  recipeNotFound: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetails);
