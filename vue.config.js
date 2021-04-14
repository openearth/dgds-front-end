module.exports = {
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
        }
      ]
    }
  }
}
