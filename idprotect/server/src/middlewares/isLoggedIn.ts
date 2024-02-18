import express from 'express'
import logger from '../config/logger'
import Admin from '../models/Admin'
import Client from '../models/Client'
import { USER_TYPE } from '../utils/enums'

function userLoggedIn (request: express.Request, response: express.Response, next: () => void): void {
  try{
    logger.debug(request.user)
    if ((request.user instanceof Client || request.user instanceof Admin) && request.isAuthenticated()) {
      logger.debug(`User is client: ${request.user instanceof Client} - User is admin: ${request.user instanceof Admin}.`)
      logger.debug(`User is authenticated: ${request.isAuthenticated()}`)
      if(request.body.type){
        const type = request.body.type
        if(request.user instanceof Client){
          if(type === USER_TYPE.INDIVIDUAL && request.user.type  === USER_TYPE.INDIVIDUAL){
            return next()
          }
          if(type === USER_TYPE.PARTNER && request.user.type  === USER_TYPE.PARTNER){
            return next()
          }
        } else if(request.user instanceof Admin){
          if(type === USER_TYPE.ADMIN){
            return next()
          }
        }
      }
    }
    logger.debug(`User is client: ${request.user instanceof Client} - User is admin: ${request.user instanceof Admin}.`)
    logger.debug(`User is authenticated: ${request.isAuthenticated()}`)
    response.status(401).json({ error: 'Vous avez été déconnecté, veuillez vous connecter à nouveau!' })
  } catch(e) {
    logger.error(`Anomalie lors de la vérification de l'accès utilisateur : ${e.message}.`)
    response.status(500).json({ error: 'Anomalie lors de la vérification de l\'accès utilisateur.' })
  }
}

export { userLoggedIn }
