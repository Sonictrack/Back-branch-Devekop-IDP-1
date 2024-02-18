import logger from '../config/logger';
import express, { Router } from 'express';
import passport from '../config/passport';
import { Op, fn } from 'sequelize';
import sequelize from '../init/database';

import { userLoggedIn } from '../middlewares/isLoggedIn';
import { USER_TYPE } from '../utils/enums';
import { PASSPORT_STRATEGY, ALERTE_TYPE } from '../utils/enums'

import Admin from '../models/Admin';
import Client from '../models/Client';
import Notification from '../models/Notification';
import renouvellement from './renouvellement'
import healthcheck from './healthcheck'
import document from './document'
import folder from './folder'
import stats from './stats'
import coffre from './coffre'
import monitoring from './monitoring'
import { alerte } from '../utils/alerte'
import notification from './notification'
import ariadnext from './ariadnext'
import { creditsVerification } from "./credits_verification_admin";

const admin = Router();

admin.use('/', renouvellement)
admin.use('/', healthcheck)
admin.use('/', document)
admin.use('/', folder)
admin.use('/', stats)
admin.use('/', coffre)
admin.use('/', monitoring)
admin.use('/', notification)
admin.use('/', ariadnext)
admin.use('/', creditsVerification)

admin.put('/user', userLoggedIn, async (req, res) => {
  const transaction = await sequelize.transaction()
  const admin = req.user as Admin
  try{
  logger.debug(`Mise à jour du compte client par l'administrateur n° ${admin.id}.`);
      const type = req.body.userTypeToCheck
      const user = JSON.parse(req.body.client)
      let result = null
      if(type === USER_TYPE.CLIENT){
        result = await Client.update(user, { where: { id: user.id }, transaction }) 
      } else if(type === USER_TYPE.ADMIN){
        result = await Admin.update(user, { where: { id: user.id }, transaction }) 
      } else {
        logger.error(`Type ${type} inconnu.`);
        throw new Error(`Type ${type} inconnu`)
      }

      if(result[0] === 0){
        logger.error(`Anomalie dans la modification du compte utilisateur ${user.id}.`)
        throw new Error('Anomalie lors de la mise à jour du compte')
      }

      await transaction.commit()        
      res.send({ success: 'Mise à jour réussie!'  })
  } catch (e) {
    await transaction.rollback()
    logger.error(`Anomalie dans la modification du compte client : ${e.message}.`)
    res.status(500).send({ error: 'Anomalie survenue lors de la mise à jour du compte client.' })
  }
})

admin.post('/users', userLoggedIn, async (req, res) => {
  const admin = req.user as Admin;
  try {
  logger.debug(`Récupération des utilisateurs par l'administrateur n° ${admin.id}.`);
    const type = req.body.userTypeToCheck
    let results = null
    if(type === USER_TYPE.CLIENT){
      const clientAttributes = [ 'id', 'createdAt', 'updatedAt', 'type','clientNumber','firstname','lastname','isVerified', 'companyName','phoneNumber','email', 'suspended','lastConnected','numberAttempt', 'sizeSpace']
      results = await Client.findAll({attributes: clientAttributes});
    } else if(type === USER_TYPE.ADMIN){
      const adminsAttributes = ['id', 'createdAt', 'updatedAt', 'role', 'firstname','lastname','email', 'suspended','lastConnected','numberAttempt']
      results = await Admin.findAll({attributes: adminsAttributes});
    } else {
      logger.error(`Type ${type} inconnu.`);
      throw new Error(`Type ${type} inconnu`)
    }

    res.send({ results });
  } catch (e) {
    logger.error(`Anomalie survenue lors de la recherche des clients : ${e.message}.`);
    res.status(500).send({error: 'Anomalie survenue lors de la recherche des clients.', });
  }
});

admin.post('/login', (req, res, next) => {
  passport.authenticate(PASSPORT_STRATEGY.PS_ADMIN, { session: true, failureFlash: true }, async (err, user, info) => {
    try{  

      if (err) { 
        throw new Error(err)
      }
      
      if (!user) { 
        logger.error(`Anomalie survenur lors de l'authentification.`)
        return res.status(401).json({ error: info.message })
      }

      logger.debug(`Connexion de l'admin ${user.id}.`)

      req.login(user, err => {
            if (err) {
              const messageConnexion = 'Anomalie survenue lors de la connexion'
              logger.error(`${messageConnexion} ${user.id} : ${err.message}.`)
              return res.status(401).json({ error: messageConnexion })
            }
      
            const result = {
              id: user.id,
              type: USER_TYPE.ADMIN,
              role: user.role,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              suspended: user.suspended,
              lastConnected: user.lastConnected,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            }

            res.json(result)  
          })  
          
        } catch(e) {
          const messageTechnique = 'Anomalie technique survenue lors de la connexion'
          logger.error(`${messageTechnique} : ${e.message}.`)
          return res.status(500).json({ error: messageTechnique })
        }
      })(req, res, next)        
})

admin.post('/account', userLoggedIn, async (req, res) => {
  const admin = req.user as Admin;
  try {
    const result = await Admin.findOne({ where: { id: admin.id } });
    if (!result) {
      logger.error('Aucun admin trouvé.')
      return res.status(404).json({ error: 'Aucun utilisateur trouvé' });
    }

        const data = { 
          id: result.id,
          type: USER_TYPE.ADMIN,
          role: result.role,
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
          suspended: result.suspended,
          lastConnected: result.lastConnected,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
      } 

        res.send(data)
    } catch (e) {
      const messageTechnique = 'Anomalie technique survenue lors de la récupération de compte'
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  })

export default admin
