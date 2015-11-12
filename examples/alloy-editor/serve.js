var express = require('express')
var makeWebpack = require('webpack')
var webpackMiddleware = require('webpack-dev-middleware')
var path = require('path')

var webpack = makeWebpack({
  entry: {
    app: './app.js'
  },
  output: {
    path: path.resolve('dist'),
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
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  devtool: 'source-map'
})

express()
.use(webpackMiddleware(webpack, {lazy: true}))
.use(express.static('.'))
.use(express.static('./node_modules/alloyeditor/dist'))
.listen(3000)
