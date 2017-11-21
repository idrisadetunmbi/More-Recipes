import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import api from './routes/api';

dotenv.config({ path: `${__dirname}/../.env` });

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  require('../webpack_devserver_config')(app);
}

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
