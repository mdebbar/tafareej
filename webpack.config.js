module.exports = {
  entry: "./entry.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {test: /\.react\.js$/, loader: "jsx-loader"},
      {test: /\.css$/, loader: "style!css"}
    ]
  }
};
