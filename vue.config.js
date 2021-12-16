const path = require('path')
const CompressionPlugin = require("compression-webpack-plugin")

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {


  productionSourceMap: false,

  configureWebpack: config => {

    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))


    if (process.env.NODE_ENV === 'production') {
        config.plugin('compressionPlugin').use(new CompressionPlugin({
          test: /\.(js|css|less)$/, // fnmatch
          threshold: 10240, // Compress data over 10K
          deleteOriginalAssets: false // Do not delete the source file
        }))
    }

    // Configure Webpack to recognize Markdown as a normal file
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use()
      .loader('file-loader')
      .end()

    // Compile the ES6 code in the VXE-table package to solve the IE11 compatibility problem
    config.module
      .rule('vxe')
      .test(/\.js$/)
      .include
        .add(resolve('node_modules/vxe-table'))
        .add(resolve('node_modules/vxe-table-plugin-antd'))
        .end()
      .use()
      .loader('babel-loader')
      .end()

  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* Less variable override for custom Ant Design themes */
          'primary-color': '#1890FF',
          'link-color': '#1890FF',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    port: 3000,
    proxy: {

      '/queue': {
        target: 'http://localhost:8080',
        ws: false,
        changeOrigin: true
      },
    }
  },

  lintOnSave: undefined
}