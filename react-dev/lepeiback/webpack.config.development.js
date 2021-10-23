const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const theme = require('./src/theme');
 
module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost', // 主机地址
    port: 8001, // 端口号
    open: true,
    inline: true,
    openPage: 'lepeiback/#/login',
    hot: true,
    publicPath: '/lepeiback/',
    historyApiFallback: true,
    overlay: {
      errors: true,
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    chunkFilename: '[name].async.js',
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      '@':`${__dirname}/src`,
      components: `${__dirname}/src/components`,
      utils: `${__dirname}/src/utils`,
      services: `${__dirname}/src/services`,
      models: `${__dirname}/src/models`,
      routes: `${__dirname}/src/routes`,
      reducers: `${__dirname}/src/reducers`,
      modules: `${__dirname}/src/modules`,
      configs: `${__dirname}/src/configs`,
      public:`${__dirname}/public`,
      images:`${__dirname}/images`
    },
  },
  stats: {
    children: false,
    warningsFilter: warn => warn.indexOf('Conflicting order between:') > -1,
  },
 
  module: {
    rules: [
      // {
      //     test: /\.less$/,
      //     use: ['style-loader', 'css-loader', 'less-loader']
      // },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader?cacheDirectory',
      },
      {
        test: /\.css$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      // {
      //   test: /\.less$/,
      //   use: [
      //     'css-hot-loader',
      //     MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         importLoaders: 1,
      //         modules: true,
      //         localIdentName: '[name]_[local]-[hash:base64:5]',
      //       },
      //     },
      //     {
      //       loader: 'less-loader',
      //       options: {
      //         javascriptEnabled: true,
      //       //   modifyVars: theme,
      //       },
      //     },
      //   ],
      //   exclude: /node_modules/,
      // },
      {
        test: /\.less$/,
        use: [

          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              // modifyVars: theme,
            },
          },
        ],
        // exclude: /src/,
      },
      {
        test: /\.(png|svg|jpg|gif|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: './assets/',
            },
          },
        ],
      },
    ],
  },
  node: {
    fs: 'empty',
    module: 'empty',
  },
  devtool: "cheap-module-source-map",
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.ejs'), // 模板
      filename: 'index.html',
      hash: true, // 防止缓存
    }),
    // new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'public'),
      },
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.currentEnv': JSON.stringify(process.env.NODE_ENV)
    })
  ],
};
