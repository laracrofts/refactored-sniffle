const { resolve } = require( 'path' )
const webpack = require('webpack')
require('dotenv').config({ path: './.env' }); 
module.exports = {
  entry: './src/javascript/index.js',
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: {
          loader: 'babel-loader' 
        } 
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  },
  output: {
    filename: 'bundle.js',
    path: resolve( __dirname, 'dist' )
  },
  devServer: {
    static: {
    directory: resolve( __dirname, 'dist' )
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env)
    }),
  ],
  target: 'web',
  mode: 'production'
}