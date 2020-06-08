import dotEnv from 'dotenv-safe'
import fromPairs from 'lodash/fromPairs'
import pkg from './package'
import { generateCustomProperties } from './plugins/custom-properties'

dotEnv.config()

export default {
  mode: 'spa',

  server: {
    port: 8000,
  },

  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    SERVER_URL: process.env.SERVER_URL,
    AUTH_URL: process.env.BASE_URL || 'http://localhost:8000',
    AUTH_AUTHORITY: process.env.AUTH_AUTHORITY,
    AUTH_ID: process.env.AUTH_ID,
    AUTH_TYPE: process.env.AUTH_TYPE,
    AUTH_SCOPE: process.env.AUTH_SCOPE,
  },

  generate: {
    fallback: 'index.html',
    exclude: [/ui-test/],
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'BlueEarth Data services',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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
    'material-design-icons/iconfont/material-icons.css',
    'vue-tour/dist/vue-tour.css',
    '~/css/main.css',
    '~/css/helpers.css',
    '~/css/transitions.css',
    '~/css/typography.css',
    '~/css/markdown.css',
    '~/css/tour.css',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/custom-properties', ssr: false },
    { src: '~/plugins/vue2mapbox-gl', ssr: false },
    { src: '~/plugins/bootstrap', ssr: false },
    { src: '~/plugins/polyfills', ssr: false },
    { src: '~/plugins/vuelidate', ssr: false },
    { src: '~/plugins/vue-gtag', ssr: false },
    { src: '~/plugins/vue-tour', ssr: false },
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
      img: ({ isDev }) => (isDev ? '[path][name].[ext]' : 'img/[name].[hash:7].[ext]'),
    },

    postcss: {
      plugins: {
        'postcss-custom-properties': {
          preserve: true,
          importFrom: [{ customProperties: fromPairs(generateCustomProperties('light')) }],
        },
      },
      preset: {
        autoprefixer: {},
      },
    },
    transpile: ['vue-echarts', 'resize-detector'],

    /*
     ** You can extend webpack config here
     */

    extend(config, ctx) {
      // This configuration is copied  from
      // https://github.com/visualfanatic/vue-svg-loader
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))

      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: 'vue-html-loader',
          },
        ],
      })

      // add frontmatter-markdown-loader
      config.module.rules.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
      })

      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }

      // Fix source maps
      if (ctx.isClient) {
        config.devtool = '#source-map'
      }
    },
  },
}
