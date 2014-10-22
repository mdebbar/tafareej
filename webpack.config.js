module.exports = {
  entry: {
    ViewPage: __dirname + '/static/js/pages/ViewPage.react'
  },
  output: {
    path: __dirname + '/static/build',
    filename: '[name].js',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      {test: /\.react\.js$/, loader: 'jsx-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},

      // fonts
      { test: /\.woff$/, loader: 'url-loader?limit=8192&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)$/, loader: 'file-loader' }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  }
};
