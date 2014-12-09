var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [
      // JS
      'React',
      'typeahead.js',
      path.join(__dirname, 'static/js/3party/qwest.js'),
      // CSS
      path.join(__dirname, 'static/css/bootstrap.css'),
      path.join(__dirname, 'static/css/typeaheadjs.css'),
    ],
    ViewPage: path.join(__dirname, 'static/js/pages/ViewPage.react'),
    HomePage: path.join(__dirname, 'static/js/pages/HomePage.react'),
  },
  output: {
    path: path.join(__dirname, 'static/build'),
    filename: '[name]-[chunkhash].js',
    publicPath: '/build/',
    sourcePrefix: '  '
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader?harmony'},
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},

      // fonts
      { test: /\.woff$/, loader: 'url-loader?limit=8192&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)$/, loader: 'file-loader' },
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  watchDelay: 50,
  plugins: [
    require('./webpack/plugins/beep_error'),
    require('./webpack/plugins/export_stats'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin(
      /* chunkName */'vendor',
      /* filename */'[name]-[chunkhash].js'
    ),
  ]
};
