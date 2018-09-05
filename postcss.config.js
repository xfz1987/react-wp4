// module.exports = {
//   plugins: [
//     require('autoprefixer')(),
//     // require('postcss-px2rem-exclude')({
//     //  remUnit: 200,
//     //  exclude: /node_modules/i
//     // })
//   ]
// };

module.exports = {
  plugins: {
    'autoprefixer': {
      "browsers": [
        "> 1%",
        "last 2 versions"
      ]
    }
  }
}