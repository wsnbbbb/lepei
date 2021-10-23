const CompressionWebpackPlugin = require('compression-webpack-plugin')

const compress = new CompressionWebpackPlugin(
  {
    filename: info => {
      return `${info.path}.gz${info.query}`
    },
    algorithm: 'gzip', 
    threshold: 10240,
    test: new RegExp(
      '\\.(' +
      ['js'].join('|') +
      ')$'
    ),
    minRatio: 0.8,
    deleteOriginalAssets: false
  }
)

module.exports = {
    outputDir: '../../consult',
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    devServer: {
      /* 自动打开浏览器 */
      open: true,
      /* 设置为0.0.0.0则所有的地址均能访问 */
      host: '0.0.0.0',
      port: 8080,
      https: false,
      hotOnly: false,
      //在本地服务器开启gzip，线上服务器都支持gzip不需要设置
      before(app) {
          app.get(/.*.(js)$/, (req, res, next) => {
              req.url = req.url + '.gz';
              res.set('Content-Encoding', 'gzip');
              next();
          })
      }

    },
    css: {
      // 是否使用css分离插件 ExtractTextPlugin
      extract: false,
      // 开启 CSS source maps?
      sourceMap: false,
      // css预设器配置项
      loaderOptions: {},
      // 启用 CSS modules for all css / pre-processor files.
      modules: false
    },
    chainWebpack: config => {
      config.optimization.minimize(true);
      config.optimization.splitChunks({
        chunks: 'all'
      });
      // config.module
      // .rule('images')
      // .use('image-webpack-loader')
      // .loader('image-webpack-loader')
      // .options({
      //     bypassOnDebug: true
      // })
      // .end()
    },
    configureWebpack: {
      externals : {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vant': 'vant',
        'vue-router': 'VueRouter',
        'moment': 'moment',
        'axios': 'axios',
        'js-md5': 'md5',
        
      },
      plugins: [compress],
      performance: {
        hints: false
      }
    },
    
 

};