module.exports = {
  entry: {
    app: [
      'webpack/hot/dev-server',
      './app.js'
    ],
    valueChangerWidget: './widget/valueChangerWidget.js',
    valueChangerWidgetDialog: './widget/valueChangerWidgetDialog.js',
    flickrWidget: './widget/flickrWidget.js',
    flickrWidgetDialog: './widget/flickrWidgetDialog.js'
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.html$/, loader: 'html-loader'},
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  },
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    poll: true
  }
};
