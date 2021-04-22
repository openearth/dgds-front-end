const marked = require('marked')
const renderer = new marked.Renderer()

module.exports = {
  pwa: {
    name: 'BlueEarth Data services',
    workboxPluginMode: 'InjectManifest',
    manifestOptions: {
      icons: [
        { src: 'favicon.ico', type: 'image/png' }
      ]
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    port: 8000
  },
  chainWebpack: config => {
    config.module.rules.delete('svg')
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'vue-html-loader'
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: 'vue-html-loader'
            },
            {
              loader: 'markdown-loader',
              options: {
                pedantic: true,
                renderer
              }
            }
          ]
        }
      ]
    }
  }
}
