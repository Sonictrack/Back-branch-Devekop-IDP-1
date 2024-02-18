module.exports = {
  apps : [
    {
      name: 'idp-app',
      port: 3000,
      autorestart: true,
      max_restarts: 3,
      script: './node_modules/@nuxt/typescript-runtime/bin/nuxt-ts.js',
      cwd: './app',
      args: 'start',
      exp_backoff_restart_delay: 100,
      combine_logs: true,
      merge_logs: true,
      error_file: process.env.PM2_LOGGER_SERVER_ERR,
      out_file: process.env.PM2_LOGGER_SERVER_OUT,
      time: true,
    },
    {
      name: 'idp-server',
      port: 8080,
      autorestart: true,
      max_restarts: 3,
      script: './dist/bin/www.js',
      cwd: './server',
      args: 'start',
      exp_backoff_restart_delay: 100,
      combine_logs: true,
      merge_logs: true,
      error_file: process.env.PM2_LOGGER_APP_ERR,
      out_file: process.env.PM2_LOGGER_APP_OUT,
      time: true,
    }

],

};
