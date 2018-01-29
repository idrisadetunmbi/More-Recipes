import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import path from 'path';

import webpackConfig from './webpack.dev';

const compiler = webpack(webpackConfig);

module.exports = (app) => {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  }));

  app.use(webpackHotMiddleware(compiler));
  app.get('*', (req, res, next) => {
    compiler.outputFileSystem
      .readFile(path.join(__dirname, '..', 'dist', 'index.html'), (err, result) => {
        if (err) {
          return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
      });
  });
};
