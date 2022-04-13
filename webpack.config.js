const path = require('path')
const outputPath = path.resolve(__dirname, 'dist')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    mode: process.env.WEBPACK_ENV,
    entry: './src/js/index.js',
    output: {
      path: outputPath,
      filename: 'assets/js/bundle.[contenthash].js',
    },

    module: {
      rules: [
        {
          test: /\.css/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: !isProduction,
                importLoaders: 2,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          loader: 'babel-loader',
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'assets/css/app.[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'html', 'index.html'),
        filename: 'index.html',
        title: 'HOME',
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'html', 'about/index.html'),
        filename: 'about/index.html',
        title: 'HOME',
      }),
      new CopyPlugin({
        patterns: [{ from: 'src/img', to: 'assets/img' }],
      }),
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        pngquant: {
          quality: '65-80',
        },
        plugins: [
          imageminMozjpeg({
            quality: 85,
            progressive: true,
          }),
        ],
      }),
    ],
    devServer: {
      contentBase: __dirname + 'src/html',
    },
  }
}
