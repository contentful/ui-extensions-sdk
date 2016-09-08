var path = require('path')

var pkg = require('./package.json')
var tags = makeTags(pkg.version)

var entry = {}
entry['cf-extension-api'] = './lib/api/index.js'
tags.forEach((tag) => {
  entry[`tagged/cf-extension-api-v${tag}`] = './lib/api/index.js'
})

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

function makeTags (version) {
  // For version 1.2.3, tags will be ['1', '1.2', '1.2.3']
  return version.split('.')
    .reduce(function (tags, component) {
      var previous = tags[0] || []
      tags.unshift(previous.concat([component]))
      return tags
    }, []).map((components) => components.join('.'))
}
