const { defineConfig } = require("@vue/cli-service");
const { VantResolver } = require("@vant/auto-import-resolver");
const AutoImport = require("unplugin-vue-components/webpack").default;

module.exports = defineConfig({
  transpileDependencies: true,
  // 禁用 ESLint
  lintOnSave: false,
  devServer: {
    allowedHosts: "all",
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [VantResolver()],
        dts: false,
      }),
    ],
    devtool: "source-map",
  },
  productionSourceMap: true,
  css: {
    sourceMap: true,
  },
  chainWebpack: (config) => {
    config.optimization.minimize(false);
  },
});
