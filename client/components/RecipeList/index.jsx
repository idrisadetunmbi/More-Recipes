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
    const { style, gridStyle } = this.props;
    return (
      isFetching ?
        <div>Loading Recipe</div> :
        <div className="row" id="recipe-gallery" style={style}>
          {
            error ?
              <div className="center">There was an error loading recipes - {error.error}</div> :
              recipes.map(recipe =>
                (
                  <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                    <Recipe gridStyle={gridStyle} key={recipe.id} recipe={recipe} />
                  </Link>))
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
