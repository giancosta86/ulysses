const path = require("path")
const webpack = require("webpack")

const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = merge(common, {
  mode: "development",

  devtool: "inline-source-map",

  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "../backend/dist/public"),
    open: false,
    compress: false,
    hot: true,
    port: 3000
  },

  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new webpack.HotModuleReplacementPlugin()
  ]
})
