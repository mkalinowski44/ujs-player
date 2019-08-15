const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
   entry: './src/index.js',
   output: {
      filename: "ujs-player.js"
   },

   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
               {
                  loader: "babel-loader",
                  options: {
                     presets: ['@babel/preset-env']
                  }
               },
            ]
         },
         {
            test: /\.html$/,
            use: [
               {
                  loader: "html-loader",
                  options: { minimize: true }
               }
            ]
         },
         {
            test: /\.scss$/,
            use: [
               'style-loader',
               'css-loader',
               'postcss-loader',
               'sass-loader',
            ]
         },
      ]
   },

   plugins: [
      new CleanWebpackPlugin(),
      new webpack.LoaderOptionsPlugin({
         options: {
            postcss: [
               autoprefixer()
            ]
         }
      }),
      new HtmlWebPackPlugin({
         template: "./src/index.html",
         filename: "./index.html"
      }),
      new MiniCssExtractPlugin({
         filename: "[name].css",
         chunkFilename: "[id].css"
      }),
      // new CopyPlugin([
      //    {
      //       from: './src/video/',
      //       to: './video/'
      //    }
      // ]),
   ],
}