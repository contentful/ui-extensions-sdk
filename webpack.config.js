var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// https://github.com/webpack/css-loader/issues/145
require('es6-promise').polyfill();

module.exports = {
  entry: {
    'cf-widget-api.js': './lib/api/index.js',
    'cf-widget-api.css': './lib/style/index.styl'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]'
  },
  resolve: {
    extensions: ['', '.js', '.css', '.styl']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }, {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract(
          'css?sourceMap!stylus?sourceMap'
        )
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('cf-widget-api.css', {allChunks: true})
  ],
  devtool: 'source-map',
}
