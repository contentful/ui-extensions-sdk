const assert = require('assert')

const webpackConfig = require('./webpack.config.js')

assert.equal(webpackConfig.module.loaders[0].loader, 'babel-loader')

webpackConfig.devtool = 'inline-source-map' // Gives us correct stack traces.

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai', 'chai', 'chai-as-promised'],
    files: [
      './test/unit/**/*.spec.js'
    ],
    exclude: [
    ],
    preprocessors: {
      './lib/index.js': ['webpack', 'sourcemap'],
      './test/unit/**/*.spec.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: { noInfo: true },
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  })
}
