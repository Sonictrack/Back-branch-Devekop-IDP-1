import logger from '../config/logger'
import passport from 'passport'
import sequelize from '../init/database'
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local'
import Notification from '../models/Notification'
import Admin from '../models/Admin'
import Client from '../models/Client'
import { ACTION } from '../utils/enums'
import { sendEmailSuspendedAccount } from '../utils/ovh-email'

function verify(userType: any, email: string, password: string, type: string, done: (error: any, user?: any, options?: IVerifyOptions) => void): void {
    
    userType.findOne({ where: { email } }).then(async (user: Client) => {
      try{
      
      await sequelize.transaction( async (transaction) => {
        const incorrectEmailOrPassword = 'Email ou mot de passe incorrect.'
        const accountSuspended = 'Votre compte à été suspendu après 3 tentatives de connexion erronnées.'

        if (!user) {
          return done(null, false, { message: incorrectEmailOrPassword })
        }
        
        if(user.suspended){
          return done(null, false, { message: accountSuspended })
        }

        if(user.isVerified || type === 'admin'){
        
          if (!user.validPassword(password)) {
            const value: number = user.numberAttempt - 1
            if (value === 0) {
              userType.update({suspended: 1, numberAttempt: value}, { where: { id: user.id }, transaction })
              logger.error(`Le compte ${user.clientNumber} a été suspendu après 3 echecs de connexion.`)
              
              await sendEmailSuspendedAccount(user.email).then((err: any) => {if(err){
                throw new Error(err)
              }})

              return done(null, false, { message: accountSuspended })
            }

            if(value !== 3)
              userType.update({numberAttempt: value}, { where: { id: user.id }, transaction }) 
            return done(null, false, { message: incorrectEmailOrPassword })
          }      
      
          if(type !== user.type && type === 'partner'){
            return done(null, false, { message: 'Partenaire inconnu.' })
          }
      
          if(type !== user.type && type === 'individual'){
            return done(null, false, { message: 'Particulier inconnu.' })
          }

          userType.update({numberAttempt: 3}, { where: { id: user.id }, transaction }) 
          return done(null, user)

        } else {
          logger.error("Email de confirmation du compte non validé par le client.")
          return done(null, false, { message: 'Vous n\'avez pas confirmé votre compte. Merci de vérifier votre email ou de redemander une confirmation.' })
        }

      })
      
    }catch(e){
      logger.error(`Anomalie lors de la vérification du compte avec l'email ${email} : ${e.message}.`)
      return done(null, false, { message: e.message })
    }

  })
}

passport.use('localClient', new LocalStrategy(
  {
    usernameField: 'email',
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    req.body.usedStrategy = 'localClient'
    logger.debug(`Strategy =  ${req.body.usedStrategy}`)
    return verify(Client, email, password, req.body.type, done)
  },
))

passport.use('localAdmin', new LocalStrategy(
  {
    usernameField: 'email',
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    req.body.usedStrategy = 'localAdmin'
    logger.debug(`Strategy =  ${req.body.usedStrategy}`)
    return verify(Admin, email, password, req.body.type, done)
  },
))

passport.serializeUser((user: Client | Admin, cb) => {
  let type = user instanceof Admin ? 'admin' : 'client'
  logger.debug(`Serializing type = ${type} id=${user.id}`)
  cb(null, { type: type, id: user.id })
})

passport.deserializeUser((idAndType, cb) => {
  const { id, type } = idAndType as { id: number, type: string }
  logger.debug(`Client id = ${id} - type = ${type}`)
   if (type === 'client') {
    Client.findOne({ where: { id },attributes: { exclude: ['password'] } }).then((user: Client | null) => {
      if (!user) {
        return cb('Utilisateur inconnu', null)
      }
      return cb(null, user)
    }).catch((err: Error) => {
      return cb(err, null)
    })
  } else {
    Admin.findOne({ where: { id: id }, attributes: { exclude: ['password'] } }).then((user: Admin | null) => {
      if (!user) {
        return cb('Utilisateur inconnu', null)
      }
      return cb(null, user)
    }).catch((err: Error) => {
      return cb(err, null)
    })
  }
})

export default passport