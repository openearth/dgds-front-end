import dotEnv from 'dotenv-safe'
import fromPairs from 'lodash/fromPairs'
import pkg from './package'
import { generateCustomProperties } from './plugins/custom-properties'

dotEnv.config()

export default {
  mode: 'spa',

  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    SERVER_URL: process.env.SERVER_URL
  },

  generate: {
    fallback: 'index.html',
    exclude: [/ui-test/]
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'Deltares Global Data Services',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    'mapbox-gl/dist/mapbox-gl.css',
    '~/css/main.css',
    '~/css/typography.css',
    '~/css/helpers.css',
    'material-design-icons/iconfont/material-icons.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/custom-properties', ssr: false },
    { src: '~/plugins/vue2mapbox-gl', ssr: false },
    { src: '~/plugins/bootstrap', ssr: false },
    { src: '~/plugins/polyfills', ssr: false },
    { src: '~/plugins/vuelidate', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa'],

  /*
   ** Build configuration
   */
  build: {
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].js' : '[name].[chunkhash].js'),
      chunk: ({ isDev }) => (isDev ? '[name].js' : '[name].[chunkhash].js'),
      css: ({ isDev }) => (isDev ? '[name].css' : '[name].[contenthash].css'),
      img: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'img/[name].[hash:7].[ext]'
    },

    postcss: {
      plugins: {
        'postcss-custom-properties': {
          preserve: true,
          importFrom: [
            { customProperties: fromPairs(generateCustomProperties('light')) }
          ]
        }
      },
      preset: {
        autoprefixer: {}
      }
    },
    transpile: ['vue-echarts', 'resize-detector'],

    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {
      // This configuration is copied  from
      // https://github.com/visualfanatic/vue-svg-loader
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))

      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: 'vue-html-loader'
          }
        ]
      })

      // add frontmatter-markdown-loader
      config.module.rules.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader'
      })

      config.module.rules.push({
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader',
        exclude: /(node_modules)/
      })

      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      if (ctx.isClient) {
        config.devtool = '#source-map'
      }
    }
  }
}
