const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  // Environment-based URLs
  const COMPONENTS_URL = process.env.COMPONENTS_URL || 
    (isProduction ? 'https://components.yourdomain.com' : 'http://localhost:3001');
  const AUTH_URL = process.env.AUTH_URL || 
    (isProduction ? 'https://auth.yourdomain.com' : 'http://localhost:3002');
  const PUBLIC_PATH = process.env.PUBLIC_PATH || 
    (isProduction ? 'https://platform.yourdomain.com/' : 'http://localhost:3000/');

  return {
  entry: "./src/index.js",
  mode: argv.mode || "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: PUBLIC_PATH,
    path: require('path').resolve(__dirname, 'dist'),
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
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("tailwindcss"),
                  require("autoprefixer"),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "hostApp",
      remotes: {
        remoteComponents:
          `remoteComponents@${COMPONENTS_URL}/remoteEntry.js`,
        authApp:
          `authApp@${AUTH_URL}/remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: "^6.20.0",
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      'process.env.COMPONENTS_URL': JSON.stringify(COMPONENTS_URL),
      'process.env.AUTH_URL': JSON.stringify(AUTH_URL),
    }),
  ],
  };
};

