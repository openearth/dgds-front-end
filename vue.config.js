const marked = require('marked')
const renderer = new marked.Renderer()

renderer.link = function(href, title, text) {
  return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
}

module.exports = {
  pwa: {
    name: 'BlueEarth Data services',
    manifestOptions: {
      icons: [{ src: 'favicon.ico', type: 'image/c-icon' }]
    }
  },
  transpileDependencies: ['vuetify'],
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
