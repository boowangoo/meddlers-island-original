const path = require('path');
const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: [
    './server/server.ts'
  ],
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'dist/server'),
    publicPath: '/'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty'
  },
  mode: 'development',
  resolve: { extensions: ['.ts', '.js'] },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};