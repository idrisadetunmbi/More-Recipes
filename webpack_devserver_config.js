import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import webpackConfig from './webpack.config';

const compiler = webpack(webpackConfig);

module.exports = (app) => {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler));
};
