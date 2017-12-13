[![Build Status](https://travis-ci.org/idrisadetunmbi/More-Recipes.svg?branch=feature-client-delete-recipe)](https://travis-ci.org/idrisadetunmbi/More-Recipes) [![Coverage Status](https://coveralls.io/repos/github/idrisadetunmbi/More-Recipes/badge.svg?branch=server-development)](https://coveralls.io/github/idrisadetunmbi/More-Recipes?branch=server-development) [![Maintainability](https://api.codeclimate.com/v1/badges/a5634122fa0eb6fe9aff/maintainability)](https://codeclimate.com/github/idrisadetunmbi/More-Recipes/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/a5634122fa0eb6fe9aff/test_coverage)](https://codeclimate.com/github/idrisadetunmbi/More-Recipes/test_coverage)

# More-Recipes

A recipe management web app for lovers of new tastes.

### State - _Active Development_

**Project is still being developed both on client and server side. Few endpoints are however available for an overview of the app.**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

```
nodejs (version 8^)
npm
git
postgresql (Version 9.6.5)
```


### Installing

```
# clone the repo
git clone https://github.com/idrisadetunmbi/More-Recipes.git

# install dependencies
npm install

# Ensure to run migrations for the db with the command below
cd server
../node_modules/.bin/sequelize db:migrate

# for development
npm run devstart

# command below builds the app (with babel) into a deployable base and starts the server
npm run start

```

#### Active endpoints
A demo of the front end is hosted on Github Pages and is available at [More-Recipes](https://idrisadetunmbi.github.io/More-Recipes/templates/index.html)

API (still under development) is hosted on Heroku and can be accessed through [More-Recipes API](https://emorerecipes.herokuapp.com)

```
# User Signup
POST /api/users/signup

# User Signin
POST /api/users/signin

POST
# API root
GET /api/

# Get all recipes
GET /api/recipes

# Add a new recipe
POST /api/recipes

# Get a recipe
GET /api/recipes/<recipeId>

# Modify a recipe
PUT /api/recipes/<recipeId>

# Delete a recipe
DELETE /api/recipes/<recipeId>

# Add review for a recipe
POST /api/recipes/<recipeId>/reviews

# Retrieve reviews for a recipe
GET /api/recipes/<recipeId>/reviews

# Retrieve recipes sorted by upvotes
GET /api/recipes?sort=upvotes&order=desc

# Rate a recipe
 # upvote a recipe
POST /api/recipes/recipeId?action=upvote

 # downvote a recipe
POST /api/recipes/recipeId?action=downvote

 # favorite a recipe
POST /api/recipes/recipeId?action=favorite

# Get User favorite recipes
GET /api/users/userId/recipes

```

## Running the tests

Tests have been configured to run with Mocha
```
npm run test
```

## Deployment

Command below will build the code (using babel) for deployment. The generated production folder can be deployed as necessary
```
npm run build
```

## Built With

* [ExpressJS](https://expressjs.com/) - The web framework used
* [Materialize CSS](materializecss.com) - Templates/FE development


## Versioning

API currently defaults to version 1. You can prepend `/v1/` to listed routes,e.g. `/api/v1/users/signup`
