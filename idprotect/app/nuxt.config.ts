import { NuxtConfig  } from '@nuxt/types'
// import webpack from 'webpack'

const nuxtConfig: NuxtConfig  = {
  ssr: false,
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'ID Protect',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'ID Protect - Déclarez la perte de vos documents d\'identité.',
      },
      {
        hid: 'author',
        name: 'author',
        content: 'ID Protect',
      },
    ],
    script: [{ src: "https://js.stripe.com/v3/" }],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  // Performance
  cssSourceMap: false,
  cache: true,
  parallel: true,
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/_global.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/vuelidate',
    '~plugins/date-filter',
    '~plugins/vuecardformat',
    '~plugins/bootstrapvueicons',
    '~plugins/vuecharts'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources',
    '@nuxtjs/toast',
    '@nuxtjs/font-awesome',
  ],

  env: {
    apiURL:
      process.env.NODE_ENV === 'production' ?
        'https://api.idprotect.fr' :
        'http://localhost:8080',
    API_KEY: process.env.VUE_APP_GOOGLE_MAP_API_KEY as string
  },

  toast: {
    position: 'top-center',
  },

  buildModules: ['@nuxt/typescript-build'],

  styleResources: {
    scss: [
      './assets/_variables.scss',
      './node_modules/bootstrap/scss/bootstrap.scss',
    ],
  },

  server: {
    host: '0.0.0.0',
    port: '3000',
  },

  /*
  ** Build configuration
  */
  build: {
    extend (webpackConfig, ctx): void {
      if (!webpackConfig.module) {return}
      /*
      ** You can extend webpack config here
      */

      // Replace all occurences of sass-loader with fast-sass-loader as Nuxt keep
      // use both during the build
      webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
        // sass-loader is only inside "oneOf" attribute
        if (!rule.oneOf) {
          return rule
        }

        rule.oneOf.map((r) => {
          // @ts-ignore
          if (!r.use.some((l) => l.loader === 'sass-loader')) {
            return r
          }
          const newLoaders = r
          // @ts-ignore
          newLoaders.use = newLoaders.use.reduce((loaderAcc, loader) => {
            if (loader.loader !== 'sass-loader') {
              return [...loaderAcc, ...[loader]]
            }
            return [...loaderAcc, ...[{
              loader: 'fast-sass-loader',
              options: loader.options,
            }]]
          }, [])
          return newLoaders
        })
        return rule
      })
    },
  },
}

export default nuxtConfig
