const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const config = require("./webpack.config");

module.exports = {
  ...config,
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    client: {
      overlay: { errors: true, warnings: false },
    },
    hot: true,
  },
  module: {
    ...config.module,
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [require("react-refresh/babel")],
            presets: ["@babel/preset-env"],
          },
        },
      },
      ...config.module.rules,
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin(), ...config.plugins],
};
