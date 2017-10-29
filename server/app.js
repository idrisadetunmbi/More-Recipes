import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import index from './routes/index';
import api from './routes/api';


import RecipeServices from './services/RecipesService';
import recipeSeeders from './seeders/recipes.json';


const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use('/api', api);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  switch (err.status) {
    case 404:
      return res.status(404).send({
        error: `Cannot ${req.method} ${req.url}`,
        message: 'specified path Not Found or method to path does not exist',
      });
    default:
      return res.status(500).send({
        error: 'Could not complete request',
      });
  }
});

export default app;

// seed recipes into dummy-data holder
if (process.env.NODE_ENV !== 'test') {
  recipeSeeders.recipes.forEach((recipe) => {
    RecipeServices.addRecipe(recipe);
  });
}
