const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      // path: require.resolve("path-browserify"),
      // crypto: require.resolve("crypto-browserify"),
      // buffer: require.resolve("buffer-browserify"),
      // stream: require.resolve("stream-browserify"),
      // assert: require.resolve("assert-browserify"),
      path: false,
      crypto: false,
      buffer: false,
      stream: false,
      assert: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              "macros",
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
      // {
      //   test: /\.tsx?$/,
      //   use: "ts-loader",
      //   exclude: /node_modules/,
      // },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      PORT: null,
    }),
  ],
};
