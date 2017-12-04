import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchRecipes } from '../../actions/recipes';


import Recipe from '../Recipe';

class RecipeList extends Component {
  componentWillMount() {

  }
  
  render() {
    const { recipes, isFetching, error } = this.props.recipes;
    return (
      isFetching ?
        <div>Loading Recipe</div> :
        <div className="row" style={{ width: '90%' }}>
          {
            error ?
              <div className="center">There was an error loading recipes - {error.error}</div> :
              recipes.map(recipe =>
                <Link key={recipe.id} to={`/recipes/${recipe.id}`}><Recipe key={recipe.id} recipe={recipe} /></Link>)
          }
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRecipes: () => dispatch(fetchRecipes()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeList);
