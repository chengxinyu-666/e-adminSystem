const { BABEL_ENV } = process.env;
const { argv } = process

const name = argv[argv.length-1];

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
    entry
      .add('@/mock')
      .end()
  },
  outputDir: BABEL_ENV ? `${BABEL_ENV}-dist` : "dist",
  // outputDir: name != 'build' ? `dist-${name}/manage` : "dist",
  devServer: {
    // 端口配置  
    port: 8888,
    // 反向代理配置
    proxy: {
      '/api': {
        // target: 'http://192.168.3.39:81/',  //后端地址
        target: 'https://api.hudaqi.cn/',     //服务器地址
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}

