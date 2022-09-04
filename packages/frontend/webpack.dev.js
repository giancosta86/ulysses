const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  mode: "development",

  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /\/node_modules\//,
        use: "swc-loader"
      }
    ]
  },

  devServer: {
    client: {
      overlay: true
    },

    historyApiFallback: true,
    open: false,
    port: 3000
  },

  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
