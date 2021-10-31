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
            plugins: [
              "macros",
              require("react-refresh/babel"),
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true,
                },
              ],
            ],
            presets: ["@babel/preset-env", "@babel/react", "@babel/typescript"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin(), ...config.plugins],
};
