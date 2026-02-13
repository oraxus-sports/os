const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const PUBLIC_PATH = process.env.PUBLIC_PATH || 
    (isProduction ? 'https://components.yourdomain.com/' : 'http://localhost:3001/');

  return {
  entry: "./src/index.js",
  mode: argv.mode || "development",
  devServer: {
    port: 3001,
    static: path.join(__dirname, "dist"),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: PUBLIC_PATH,
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteComponents",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button.jsx",
        "./Card": "./src/components/Card.jsx",
        "./Login": "./src/components/Login.jsx",
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, eager: true, requiredVersion: "^18.0.0" },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  };
};