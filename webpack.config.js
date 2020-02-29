const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './site/app.jsx',
  },

  mode: 'development',

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[contenthash].js',
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      Component: path.resolve(__dirname, './site/component'),
    }
  },

  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },

  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'global',
                context: __dirname,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
              localsConvention: 'asIs',
            }
          }
        ]
      }
    ]
  },

  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'initial',
      // maxSize: 500000,
      // minSize: 300000,
    }
  },

  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      // title: 'ModuleGraph Analysis'
      template: './index.html',
      filename: './index.html',
    }),
    new CleanWebpackPlugin(),
  ],

  watch: true
}