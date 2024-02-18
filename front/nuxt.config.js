import fr from './lang/fr.json'

export default {

  head: {
    bodyAttrs: {
      // class: 'blue'
    }
  },

  i18n: {
    locales: ['fr'],
    defaultLocale: 'fr',
    vueI18n: {
      fallbackLocale: 'fr',
      messages: {
        fr
      }
    }
  },

  vuetify: {
    lang: {
      locales: { fr },
      current: 'fr'
    },
    defaultAssets: {
      font: {
        family: 'Raleway'
      }
    }
  },

  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false // Or `bvCSS: false`
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'ID Protect',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'ID Protect - Déclarez la perte de vos documents d\'identité.'
      },
      {
        hid: 'author',
        name: 'author',
        content: 'ID Protect'
      }
    ],
    script: [{ src: 'https://js.stripe.com/v3/' }],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    baseUrl: process.env.BASE_URL
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/css/main.css',
    '~/assets/css/style.css',
    // '~/assets/css/style.min.css',
    '~/assets/css/client-area.css',
    '~/assets/css/pink-theme.css',
    '~/assets/css/blue-theme.css',
    '~/assets/css/normalize.css',
    '~/assets/css/contact.css',
    '~/assets/css/demandes.css',
    '~/assets/css/home.css',
    '~/assets/css/particular-account.css',
    '~/assets/css/static_pages.css',
    '~/assets/css/stepper.css',
    '~/assets/css/custom.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/api',
    '~plugins/vue-modal.js',
    '~/plugins/fontawesome.js',
    { src: '~/plugins/aos', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    //'@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxt-hero-icons/solid/nuxt',
    ['@nuxtjs/moment', {
      defaultLocale: 'fr',
      locales: ['fr']
    }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    ['nuxt-mail'],
    ['nuxt-i18n', {
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        onlyOnRoot: true
      }
    }],
    'bootstrap-vue/nuxt',
    ['vue-scrollto/nuxt', { duration: 300 }],
    '@nuxtjs/toast'
  ],

  mail: {
    message: {
      to: process.env.CONTACT_MAIL
    },
    smtp: {
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      },
      tls: {
        //secureProtocol: "TLSv1_method", 
        rejectUnauthorized: false,
      }
    }
  },

  toast: {
    position: 'top-center'
  },

  axios: {
    baseUrl: process.env.BASE_URL,
    proxy: true,
    withCredentials: true,
    credentials: true,
    // debug: true,
    init (axios) {
      axios.defaults.withCredentials = true
    }
  },

  // server: {
  //   host: '0.0.0.0'
  // },

  proxy: {
    '/api/': {
      target: process.env.BASE_URL,
      pathRewrite: {
        '^/api/': '',
        changeOrigin: true
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    }
  },
}
