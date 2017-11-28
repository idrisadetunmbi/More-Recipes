import React, { Component } from 'react';
import './index.css';

export default class Recipe extends Component {
  state = {

  }

  componentDidMount() {

  }

  render() {
    const { recipe } = this.props;
    return (
      <div className="col s12 l3 m4">
        <div className="card">
          <div className="card-image">
            <img alt={recipe.title} />
          </div>
          <div className="card-content">
            <span className="card-title">{recipe.title}</span>
            <p>{recipe.description}</p>
          </div>
          <div className="card-action">
            <span><i className="material-icons">thumb_up</i>{recipe.upvotes}</span>
            <span><i className="material-icons">star</i>{recipe.favorites}</span>
          </div>
        </div>
      </div>
    );
  }
}

