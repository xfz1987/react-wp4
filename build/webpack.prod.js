const { resolve } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const baseConfig = require('./webpack.base.js')
const cf = require('./config.js').build

const prodConfig = {
  output: {
    path: resolve(__dirname, cf.assetsSubDirectory), 
    publicPath: cf.assetsPublicPath,
    filename: `${cf.js}/[name].[chunkhash:5].js`
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
            options: {
              limit: 8192,
              name: `${cf.images}/[name].[hash:5].[ext]`,
              publicPath: cf.assetsPublicPath
            }
          }
        ]
      }
    ]
  },
  /**
    * 优化部分包括代码拆分
    * 且运行时（manifest）的代码拆分提取为了独立的 runtimeChunk 配置 
  */
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 提取 node_modules 中代码
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        },
        commons: {
          // async 设置提取异步代码中的公用代码
          chunks: 'async',
          name: 'commons-async',
          /**
           * minSize 默认为 30000
           * 想要使代码拆分真的按照我们的设置来
           * 需要减小 minSize
           */
          minSize: 0,
          // 至少为两个 chunks 的公用代码
          minChunks: 2
        },
        styles: {
          name: 'main',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    /**
     * 对应原来的 minchunks: Infinity
     * 提取 webpack 运行时代码
     * 直接置为 true 或设置 name
     */
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // 提取css
    new MiniCssExtractPlugin({
      filename: `${cf.css}/[name].[chunkhash:5].css`,
    }),
    // 静态文件拷贝
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: 'static',
    //     ignore: ['.*']
    //   }
    // ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve(__dirname, '../src/index.html'),
      title: '后台管理系统',
      prefetch: cf.assetsPublicPath[cf.assetsPublicPath.length-1] == '/' ? cf.assetsPublicPath.substr(0, cf.assetsPublicPath.length-1) : cf.assetsPublicPath,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      }
    }),
    // 代码打包分析
    new BundleAnalyzerPlugin({ analyzerPort: 3011 })
  ]
}

module.exports = merge(baseConfig, prodConfig)