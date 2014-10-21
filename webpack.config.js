var webpack = require('webpack');

module.exports = {
  entry: {
    ViewPage: __dirname + '/static/js/pages/ViewPage.react'
  },
  output: {
    path: __dirname + '/static/build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {test: /\.react\.js$/, loader: "jsx-loader"},
      {test: /\.css$/, loader: "style!css"}
    ]
  },
  resolve: {
    extensions: ['', '.js']
  }
};
