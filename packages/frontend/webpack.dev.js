const path = require("path")
const webpack = require("webpack")

const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

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

  plugins: [new webpack.HotModuleReplacementPlugin()]
})
