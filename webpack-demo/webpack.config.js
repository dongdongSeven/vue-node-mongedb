var HtmlWebpackPlugin=require('html-webpack-plugin');
var CleanWebpackPlugin=require('clean-webpack-plugin');
var ExtractTextPlugin=require('extract-text-webpack-plugin');
var path=require('path');
var webpack=require('webpack');

module.exports = {
  entry:{
    vendor:['jquery','./src/js/common.js'],
    index:'./src/js/index.js',
    cart:'./src/js/cart.js'
  },
  output:{
    path:path.resolve(__dirname,'dis'),
    filename:'js/[name].js',
    publicPath:""
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        loader:'babel-loader',
        exclude:/node_modules/,
        include:path.join(__dirname,'src'),
        options:{
          presets:['env']
        }
      },
      {
        test:/\.css$/,
        include:path.join(__dirname,'src'),
        exclude:/node_modules/,
        use:ExtractTextPlugin.extract({
          fallback:'style-loader',
          use:'css-loader'
        })
      }
    ]
  },
  plugins:[
    new ExtractTextPlugin("styles.css"),
    new CleanWebpackPlugin(['./dis'],{
        root:path.resolve(__dirname,''),
        verbose:true,
        dry:false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name:'vendor',
      chunks:['index','cart','vendor'],
      mikChunks:3
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings:false
      }
    }),
    new HtmlWebpackPlugin({
      filename:'index.html',
      template:'./src/index.html',
      chunks:['index','vendor'],
      minify:{
        collapseWhitespace:true,
        removeComments:true
      }
    }),
    new HtmlWebpackPlugin({
      filename:'cart.html',
      template:'./src/cart.html',
      chunks:['cart','vendor']
    })
  ]
  // devtool:'#source-map'
}