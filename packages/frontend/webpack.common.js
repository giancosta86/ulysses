const { resolve } = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.(js|ts)$/i,
        use: [
          {
            loader: "comlink-loader",
            options: {
              singleton: true
            }
          }
        ],

        exclude: /node_modules/
      },

      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /node_modules/
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [new TsconfigPathsPlugin({})]
  },

  entry: {
    main: resolve(__dirname, "src/index.tsx")
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "Ulysses for Omnicourse",
      filename: "index.html",
      favicon: resolve(__dirname, "src/images/favicon.ico")
    })
  ]
};
