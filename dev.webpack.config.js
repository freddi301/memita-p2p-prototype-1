const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const config = require("./webpack.config");
const { LOCAL_RPC_WEBSOCKET_PORT, LOCAL_RPC_WEBSOCKET_PATH } = require("./dist/rpc/local/websocket/common");

if (!process.env.PORT) throw new Error("PORT not specified");

module.exports = {
  ...config,
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    client: {
      overlay: { errors: true, warnings: false },
    },
    hot: true,
    port: Number(process.env.PORT),
    proxy: {
      [LOCAL_RPC_WEBSOCKET_PATH]: {
        target: `http://localhost:${LOCAL_RPC_WEBSOCKET_PORT}`,
        ws: true,
        changeOrigin: true,
      },
    },
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
      {
        test: /\.svg/,
        type: "asset/inline",
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin(), ...config.plugins],
};
