const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });


module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: 'async/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, process.env.NODE_ENV === "preProduction" ? '../../lepeiback':'../../../lepeiCloudSchool'),
    publicPath: './',
    chunkFilename: 'async/[name].[chunkhash:8].async.js',
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
 
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        use: ['happypack/loader?id=babel'],
      },
      {
        test: /\.css$/,
        use: [
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
      //         // modifyVars: theme,
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
  stats: {
    children: false,
    warningsFilter: warn => warn.indexOf('Conflicting order between:') > -1,
  },
  node: {
    fs: 'empty',
    module: 'empty',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)/,
          chunks: 'all',
          enforce: true,
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
    runtimeChunk: true,
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
    new CleanWebpackPlugin([process.env.NODE_ENV === "preProduction" ? '../../lepeiback':('../../../lepeiCloudSchool/assets','../../../lepeiCloudSchool/async')], { 
      allowExternal: true
    }),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, 'public'),
    //   },
    // ]),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool: happyThreadPool,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env.currentEnv': JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyWebpackPlugin(
      [
        { from: path.resolve(__dirname, './src/template'), to: path.resolve(__dirname, process.env.NODE_ENV === "preProduction" ? '../../lepeiback/template' : '../../../lepeiCloudSchool/template')}
      ])
  ],

  performance: {
      hints: "warning", // 枚举
      maxAssetSize: 30000000, // 整数类型（以字节为单位）
      maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
      assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
      
      }
  }
};
