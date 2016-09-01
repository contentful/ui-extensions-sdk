var path = require('path')

var pkg = require('./package.json')
var version = pkg.version

var entry = {}
entry['cf-extension-api'] = './lib/api/index.js'
entry[`cf-extension-api-v${version}`] = './lib/api/index.js'

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'contentfulExtension',
    libraryTarget: 'umd'
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
