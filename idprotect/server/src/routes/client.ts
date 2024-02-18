import logger from '../config/logger'
import { Router } from 'express'
import passport from '../config/passport'
import sequelize from '../init/database'
import del from 'del'
import path from 'path'
import { registration } from './registration'
import { userLoggedIn } from '../middlewares/isLoggedIn'
import { getUserSpace } from '../utils/filesystem'
import { PASSPORT_STRATEGY } from '../utils/enums'

import Client from '../models/Client'
import email from './email'
import folder from './folder'
import document from './document'
import notification from './notification'
import position from './position'
import renouvellement from './renouvellement'
import payment from './payment'
import coffre from './coffre'
import monitoring from './monitoring'
import { followedDocuments } from './followed-documents'
import { documentViewRequests } from './document-view-requests'
import { creditsVerification } from './credits_verification'
import ariadnext from './ariadnext'

const client = Router()

client.use('/', email)
client.use('/', folder)
client.use('/', document)
client.use('/', notification)
client.use('/', position)
client.use('/', renouvellement)
client.use('/', payment)
client.use('/', coffre)
client.use('/', monitoring)
client.use('/', documentViewRequests)
client.use('/', followedDocuments)
client.use('/', creditsVerification)
client.use('/', ariadnext)

client.post('/register', (req, res) => registration(req, res))

client.post('/login', (req, res, next) => {
    passport.authenticate(PASSPORT_STRATEGY.PS_CLIENT, { session: true, failureFlash: true }, async (err, user, info) => {
      logger.info("Appel POST /LOGIN")
      try{  

        if (err)
          throw new Error(err)
        
        if (!user) { 
          logger.error(`Utilisateur inconnu : ${info.message}`)
          return res.status(401).json({ error: info.message })
        }

        const client = user as Client 
        logger.debug(`Connexion du client ${client.clientNumber}.`)


        req.login(user, err => {
              if (err) {
                const messageConnexion = "Echec de connexion"
                logger.error(`${messageConnexion} ${user.clientNumber} : ${err.message}.`)
                return res.status(401).json({ error: messageConnexion })
              }
        
              const result = {
                id: client.id,
                type: client.type,
                clientNumber: client.clientNumber,
                firstname: client.firstname,
                lastname: client.lastname,
                companyName: client.companyName,
                phoneNumber: client.phoneNumber,
                email: client.email,
                suspended: client.suspended,
                lastConnected: client.lastConnected,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
                sizeSpace: client.sizeSpace,
                sizeSpaceUsed: getUserSpace(client.clientNumber)
              }

              res.json(result)  
            })  
            
          } catch(e) {
            const messageTechnique = "Anomalie technique survenue lors de la connexion"
            logger.error(`${messageTechnique} : ${e.message}.`)
            return res.status(500).json({ error: messageTechnique })
          }
        })(req, res, next)        
  })

client.post('/account', userLoggedIn, async (req, res) => {
  logger.info("Appel POST /ACCOUNT")
  try {
        const client = req.user as Client
        const clientNumber = client.clientNumber

        logger.debug(`Récupération du compte client ${clientNumber}`)
        const result = await Client.findOne({ where: { id: client.id } })    

        if (!result) {
          const messageFind = "Impossible de trouver le compte"
          logger.error(`${messageFind} ${clientNumber}`)
          return res.status(404).json({ error: messageFind })
        }

        const data = { 
          id: result.id,
          type: result.type,
          clientNumber: result.clientNumber,
          firstname: result.firstname,
          lastname: result.lastname,
          companyName: result.companyName,
          phoneNumber: result.phoneNumber,
          email: result.email,
          suspended: result.suspended,
          lastConnected: result.lastConnected,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          sizeSpace: client.sizeSpace,
          sizeSpaceUsed: getUserSpace(client.clientNumber),
          credits: result.credits
      } 

        res.send(data)
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors de la récupération de compte"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  })

client.put('/account', userLoggedIn, async (req, res) => {
    logger.info("Appel PUT /ACCOUNT")
    const transaction = await sequelize.transaction()
    try{
    const client = req.user as Client
    const clientNumber = client.clientNumber

    const {id, firstname, lastname, companyName, phoneNumber} = JSON.parse(req.body.account)
    
    logger.debug(`Modification de compte ${clientNumber}.`)
    const result = await Client.update({firstname, lastname, companyName, phoneNumber}, { where: { id }, transaction }) 

    if(result[0] === 0){
      const messageUpdate = "Impossible de modifier le compte"
      logger.error(`${messageUpdate} ${clientNumber}.`)
      return res.status(404).send({ error: messageUpdate })
    }

    await transaction.commit()        
    res.send({ success: 'success'  })
    } catch (e) {
      await transaction.rollback()
      const messageTechnique = "Anomalie technique survenue lors de la modification de compte"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  })

client.delete('/account', userLoggedIn, async (req, res) => {
    logger.info("Appel DELETE /ACCOUNT")
    const transaction = await sequelize.transaction()
    try {
      const client = req.user as Client
      const clientNumber = client.clientNumber
      
      logger.debug(`Suppression de compte client ${clientNumber}`)

      if(client.type === 'individual' || client.type === 'partner'){
          logger.debug("Suppression des fichiers du repertoire.")
          const dir = './'+process.env.FILE_SYSTEME_DIR + path.sep + clientNumber   
          const resultDel = del.sync(dir, { onlyFiles: false })
      }

      const result = await Client.destroy({ where: { clientNumber: clientNumber }, transaction })  

      if(result === 0){
        const messageDestroy = "Le compte n'a pu être supprimé"
        logger.error(`${messageDestroy} ${clientNumber}.`)
        return res.status(404).send({ error: messageDestroy })
      }

      await transaction.commit()
      return req.session!.destroy(() => { return res.json({ success: true }) })      
    } catch (e) {
      await transaction.rollback()
      const messageTechnique = "Anomalie technique survenue lors de la suppression de compte"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  },
)

export default client