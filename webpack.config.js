var path = require('path')

module.exports = {
  entry: {
    'cf-widget-api': './lib/api/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: [] // 'babel-plugin-rewire' in karma.conf.js
        }
      }
    ]
  },
  devtool: 'source-map'
}
