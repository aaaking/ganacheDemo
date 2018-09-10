const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // For example, if your app is deployed at https://foobar.com/vue-blog set baseUrl to '/vue-blog/'
  baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'));
  },
  devServer: {
    // changeOrigin: true, // 是否启用跨域
    // open: true,//process.platform === 'darwin',
    host: '0.0.0.0',
    port: 5110,
    // https: false,
    // hotOnly: false,
    // proxy: null
    // before: app => {}
  },
  pluginOptions: {}
};
