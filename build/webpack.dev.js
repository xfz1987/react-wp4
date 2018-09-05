const { resolve } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const baseConfig = require('./webpack.base.js')
const cf = require('./config.js').dev

const devConfig = {
  output: {
    path: resolve(__dirname, cf.assetsSubDirectory),
    publicPath: cf.assetsPublicPath,
    filename: `${cf.js}/[name].js`
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|woff|woff2|ttf|svg|otf)$/,
        use:[
          {
            loader: 'url-loader',
            options:{
              limit: 8192,
              name: `${cf.images}/[name].[ext]`
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve(__dirname, '../src/index.html'),
      title: '开发环境',
    })
  ],
  devServer: {
    clientLogLevel: 'warning',
    inline: true,
    hot: true,
    overlay: {
      errors: true,
      warnings: true
    },
    // 跟 friendly-errors-webpack-plugin 插件配合
    quiet: true,
    progress: true,
    contentBase: resolve(__dirname, '../dist'),
    compress: true,
    port: cf.port,
    watchContentBase: true,
    historyApiFallback: true,
    proxy : {
      '/manage' : {
          target: 'http://admintest.happymmall.com',
          changeOrigin : true
      },
      '/user/logout.do' : {
          target: 'http://admintest.happymmall.com',
          changeOrigin : true
      }
    }
  }
}


module.exports = merge(baseConfig, devConfig)