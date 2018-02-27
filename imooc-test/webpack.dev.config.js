var htmlWebpackPlugin=require('html-webpack-plugin');
var ExtractTextPlugin=require('extract-text-webpack-plugin');
var CleanWebpackPlugin=require('clean-webpack-plugin');
var path=require('path');
var webpack=require('webpack');

module.exports={
  context: __dirname,
  entry:"./src/app.js",
  output:{
    filename:'js/[name].bundle.js',
    path:__dirname+'/dis'
  },
  module:{
    rules:[
      {
        test:/\.tpl$/,
        loader:'ejs-loader'
      },
      {
        test:/\.html$/,
        loader:'html-loader'
      },
      {
        test:/\.js$/,
        loader:'babel-loader',
        exclude:/node_modules/,
        include:path.resolve(__dirname,'/src/'),
        options:{
          presets:['env']
        }
      },
      // {
      //   test:/\.(css|less)$/,
      //   use:[
      //     'style-loader',
      //     'css-loader',
      //     { 
      //       loader: 'postcss-loader', 
      //       options: {
      //         ident:'postcss',
      //         plugins:(loader) => [
      //           require('postcss-import')({ root: loader.resourcePath }),
      //           require('autoprefixer')()
      //         ]
      //       }
      //     },
      //     'less-loader'
      //   ]
      // },
      {
        test:/\.(css|less)$/,
        use:ExtractTextPlugin.extract({
          fallback:'style-loader',
          use:[
            'css-loader',
            {
              loader:'postcss-loader',
              options:{
                inden:'postcss',
                plugins:loader => [
                  require('postcss-import')({root:loader.resourcePath}),
                  require('autoprefixer')()
                ]
              }
            },
            'less-loader'
          ]
        })
      }
    ]
  },
  plugins:[
    new ExtractTextPlugin('styles.css'),
    new CleanWebpackPlugin(['./dis'],{
      root:path.resolve(__dirname,''),
      verbose:true,
      dry:false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{//压缩JS
        warnings:true  //删除注释
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   chunks:['a','b','vendor'],
    //   mikChunk:3
    // }),
    new htmlWebpackPlugin({
      filename:'index.html',
      template:'index.html',
      // inject:false,
      // chunks:['a','vendor'],
      title:'this is a index.html',
      minify:{
        collapseWhitespace:true,
        removeComments:true
      }
    })
  ]
}