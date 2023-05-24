const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  outputDir: 'dist',
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'My Awesome Website';
      return args;
    });
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico',
    },
  },
});