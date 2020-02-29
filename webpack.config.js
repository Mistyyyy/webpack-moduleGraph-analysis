const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './site/app.jsx',
  },

  context: __dirname,
  mode: 'development',

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: './',
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      Component: path.resolve(__dirname, './site/component'),
    },
    modules: ['node_modules'],
    symlinks: false
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },

  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            cacheDirectory: true,
            presets: [
              '@babel/preset-react'
            ],
            plugins: [
                [
                  "import",
                  {
                    "libraryName": "antd",
                    "libraryDirectory": "es",
                    "style": "css" // `style: true` 会加载 less 文件
                  }
              ]
            ]
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
      chunks: 'all',
    }
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: './index.html',
    }),
  ],
}
