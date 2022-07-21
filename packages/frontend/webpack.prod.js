const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

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

  optimization: {
    usedExports: false
  }
});
