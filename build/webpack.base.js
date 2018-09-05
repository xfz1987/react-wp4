const { resolve } = require('path')
const argv = require('yargs-parser')(process.argv.slice(2))
const webpack = require('webpack')

const _mode = argv.mode || 'development'

module.exports = {
  mode: _mode,
  target: 'web',
  entry: {
    app: [resolve(__dirname, '../src/index.js')]
  },
  resolve: {
    alias : {
        pages        : resolve(__dirname, '../src/pages'),
        components   : resolve(__dirname, '../src/components'),
        util         : resolve(__dirname, '../src/util'),
        stores       : resolve(__dirname, '../src/stores'),
        layout       : resolve(__dirname, '../src/layout'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre', //在其他loader处理前，先eslint，post为之后
        options: {
          outputReport: {
            filePath: 'checkstyle.xml',
            formatter: require('eslint/lib/formatters/checkstyle')
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: '/(node_modules)/',
        loader: 'babel-loader'
      }
    ]
  }
}