import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import deepEqual from 'deep-equal';

import { recipeAction } from '../../actions/recipe';
import './index.css';
import DetailsView from './DetailsView';
import EditView from './EditView';

// TODO: add more props as might be required
class RecipeDetails extends React.Component {
  state = {
    isDetailsMode: true,
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.recipe, this.props.recipe)) {
      this.toggleViewMode();
    }
  }

  toggleViewMode = () => {
    this.setState({ isDetailsMode: !this.state.isDetailsMode });
  }

  render() {
    const { recipe, user, history } = this.props;
    if (!recipe) {
      history.replace('/catalog');
      return null;
    }
    return (this.state.isDetailsMode ?
      <DetailsView {...this.props} toggleViewMode={this.toggleViewMode} /> :
      <EditView {...this.props} toggleViewMode={this.toggleViewMode} />
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    recipe: state.recipes.recipes.filter(recipe => recipe.id === ownProps.match.params.recipeId)[0],
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteRecipe: recipeId => dispatch(recipeAction('delete', recipeId)),
    updateRecipe: recipeData => dispatch(recipeAction('update', recipeData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetails);
