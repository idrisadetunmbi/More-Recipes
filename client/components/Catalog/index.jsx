import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

import Recipe from '../Recipe';
import { LoaderWithComponent } from '../reusables';
import './index.scss';
import { fetchRecipes, searchRecipes } from '../../actions/recipes';

/**
 * @export
 * @class Catalog
 * @extends {Component}
 */
export class Catalog extends Component {
  state = {
    searchTerm: '',
    searchMode: false,
  }

  /**
   * @returns {void}
   * @memberOf Catalog
   */
  componentWillUnmount() {
    // scroll to top of the page incase infinite scroll 'scrollTop button'
    // gets clicked
    window.scrollTo(0, 0);
  }

  /**
   * onClick handler for add recipe button
   * @returns {void}
   * @memberOf Catalog
   */
  addRecipeOnClick = () => {
    const { history } = this.props;
    if (!this.props.user.data.token) {
      history.push('/signin', {
        modal: true,
        previousLocation: history.location.pathname,
      });
      return;
    }
    history.push('/recipes/create', {
      modal: true,
      previousLocation: history.location.pathname,
    });
  }

  /**
   * handles enter key press when search input element is focused
   * @param {object} event - DOM event object
   *
   * @returns {void}
   * @memberOf Catalog
   */
  enterKeyPress = (event) => {
    if (event.keyCode === 13) {
      event.stopPropagation();
      const searchInput = document.querySelector('input');
      const searchTerm = searchInput.value;
      if (!searchTerm) {
        return;
      }
      this.setState({ searchMode: true, searchTerm });
      this.props.searchRecipes(searchTerm);
    }
  }

  /**
   * @param {event} event - DOM event object
   *
   * @returns {void}
   * @memberOf Catalog
   */
  handleClearSearchClick = (event) => {
    const searchInput = document.querySelector('input');
    event.stopPropagation();
    searchInput.value = '';
    searchInput.focus();
    event.target.style.display = 'none';
    this.setState({ searchMode: false });
  }

  /**
   * @param {event} event - DOM event object
   *
   * @returns {void}
   * @memberOf Catalog
   */
  handleSearchInputChange = (event) => {
    const { value } = event.target;
    const clearSearchButton = document.getElementById('clear-search');
    if (!value) {
      this.setState({ searchMode: false });
      clearSearchButton.style.display = 'none';
      return;
    }
    clearSearchButton.style.display = 'inline-block';
  }

  renderLoader = () => (
    <div className="infinite-scroll">
      <div className="preloader-wrapper small active">
        <div className="spinner-layer spinner-green-only">
          <div className="circle-clipper left">
            <div className="circle" />
          </div>
          <div className="gap-patch">
            <div className="circle" />
          </div>
          <div className="circle-clipper right">
            <div className="circle" />
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * @param {Array} recipes - list of recipes to render
   *
   * @returns {JSX.Element} - list of recipe cards
   * @memberOf Catalog
   */
  renderRecipes = recipes =>
    recipes.map(recipe => (
      <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
        <Recipe gridStyle="l4 s12 m6" recipe={recipe} />
      </Link>
    ))

  renderSearch = () =>
    (
      <div id="search-section" className="row">
        <div className="col offset-l3 l9 m12 s12">
          <input
            placeholder="Search Recipe"
            type="search"
            onFocus={() => { document.addEventListener('keydown', this.enterKeyPress); }}
            onBlur={() => { document.removeEventListener('keydown', this.enterKeyPress); }}
            onChange={this.handleSearchInputChange}
          />
          <i
            onClick={this.handleClearSearchClick}
            id="clear-search"
            className="material-icons"
          >
            cancel
          </i>
        </div>
      </div>
    )

  renderSuggestionSection = () => (
    <div className="col l3" id="suggestion-section">
      <h5>Today{'\''}s Combo</h5>
      <div className="divider" />
      <div className="recipe">
        <div className="card">
          <div className="card-image">
            <img alt="" src="images/sample_recipes/recipe0116-xl-farro-with-vinegar-glazed-sweet-potato-and-apples.jpg" />
          </div>
          <div className="card-content">
            <span className="card-title">Farrow with vinegar, glazed sweet potato and apples</span>
            <p>I am a very simple card. I am good at containing small&nbsp;
          bits of information. I am convenient because I require&nbsp;
          little markup to use effectively.
            </p>
          </div>
          <div className="card-action">
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>
    </div>
  )

  renderAddRecipeButton = () => (
    <div className="fixed-action-btn">
      <a className="btn-floating btn-large pulse" onClick={this.addRecipeOnClick}>
        <i className="material-icons">add</i>
      </a>
    </div>
  )

  renderCatalogWithInfiniteScroll = () => {
    const scrollEndOnClick = (event) => {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: $('#catalog-component').offset().top,
      }, 500);
    };
    const endMessage = () => (
      <h5 className="infinite-scroll">
        There are no more recipes.
        <a onClick={scrollEndOnClick}> Go to Top</a>
      </h5>
    );

    const { recipes } = this.props;
    return (
      <LoaderWithComponent
        showLoader={recipes.requestInitiated && !recipes.recipes.length}
        component={
          <InfiniteScroll
            next={this.props.fetchRecipes}
            hasMore={!recipes.fetchedAll}
            loader={this.renderLoader()}
            scrollThreshold={0.8}
            endMessage={endMessage()}
            style={{ position: 'relative' }}
          >
            {this.renderRecipes(recipes.recipes)}
          </InfiniteScroll>}
      />
    );
  }

  renderSearchResults = () => {
    const { searchTerm } = this.state;
    const searchResults = this.props.recipes
      .searchResults[searchTerm.toLowerCase()];
    const endMessage = <h5 className="infinite-scroll">There are no more recipes matching the search term</h5>;

    return (
      <LoaderWithComponent
        showLoader={!searchResults}
        component={
          searchResults && searchResults.results.length ?
            <InfiniteScroll
              next={() => this.props.searchRecipes(this.state.searchTerm)}
              hasMore={!searchResults.matchedAll}
              loader={this.renderLoader()}
              scrollThreshold={0.8}
              endMessage={endMessage}
              style={{ position: 'relative' }}
            >
              {
                this.renderRecipes(this.props.recipes.recipes.filter(recipe =>
                  searchResults.results.includes(recipe.id)))
              }
            </InfiniteScroll> :
            <h5>No results found for {this.state.searchTerm}</h5>
        }
      />
    );
  }

  /**
   * @returns {JSX.Element} JSX element representing the whole catalog page
   * @memberOf Catalog
   */
  render() {
    return (
      <div id="catalog-component">
        {this.renderSearch()}
        <div id="main-divider" className="divider" />
        <div className="row">
          {this.renderSuggestionSection()}
          <div className="col l9 s12">
            <h5>{this.state.searchMode ?
              `Search Results for ${this.state.searchTerm}` : 'Featured Recipes'}
            </h5>
            <div className="divider" id="gallery-before" />
            {
              this.state.searchMode ?
                this.renderSearchResults() :
                this.renderCatalogWithInfiniteScroll()
            }
          </div>
        </div>
        {this.renderAddRecipeButton()}
      </div>
    );
  }
}

Catalog.propTypes = {
  recipes: PropTypes.shape({
    recipes: PropTypes.array,
    fetchedAll: PropTypes.bool,
    requestInitiated: PropTypes.bool.isRequired,
    searchResults: PropTypes.shape().isRequired,
  }).isRequired,

  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }).isRequired,

  user: PropTypes.shape({
    data: PropTypes.shape({
      token: PropTypes.string,
    }),
  }).isRequired,

  fetchRecipes: PropTypes.func.isRequired,
  searchRecipes: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  recipes: state.recipes,
});

const mapDispatchToProps = dispatch => ({
  fetchRecipes: () => dispatch(fetchRecipes()),
  searchRecipes: searchTerm => dispatch(searchRecipes(searchTerm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
