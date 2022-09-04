const { resolve } = require("node:path");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /\/node_modules\//,
        use: "ts-loader"
      }
    ]
  },

  devtool: "source-map",

  plugins: [new CleanWebpackPlugin()],

  output: {
    path: resolve(__dirname, "../backend/dist/frontend"),
    filename: "[name].bundle.js",
    hashFunction: "xxhash64"
  },

  optimization: {
    usedExports: false
  }
});
