#!/usr/bin/env node

import logger from '../config/logger'
import app from '../app'
import database from '../init/database'
import debugModule from 'debug'
import http from 'http'

const debug = debugModule('app:server')

/**
 * Get port from environment and store in Express.
 */
let fallbackPort: string
let hostname: string

if (process.env.NODE_ENV === 'development') {
  fallbackPort = '8080'
  hostname = 'localhost'
} else {
  fallbackPort = '8080'
  hostname = 'localhost'
}

const port = normalizePort(process.env.PORT || fallbackPort)
app.set('port', port)

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 * Wait for the database to connect first.
 */
database.sync()
  .then(() => {
    // @ts-ignore
    server.listen(port, hostname)
    server.on('error', onError)
    server.on('listening', onListening)
    return
  })
  .catch((err: Error) => {
    logger.error('Failed to start database:', err)
    return
  })

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val: string): string | number | false {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error: any): void {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening (): void {
  logger.info(`==Environnement: ${process.env.NODE_ENV}==`)
  const addr: any = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
    logger.info('Listening on ' + bind)
}
