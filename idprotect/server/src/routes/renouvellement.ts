import logger from '../config/logger'
import sequelize from '../init/database'
import { Router } from 'express'
import { STATUS } from '../utils/enums'
import Renouvellement from '../models/Renouvellement'
import { sendEmailRecapRenewDocument } from '../utils/ovh-email'
import { userLoggedIn } from '../middlewares/isLoggedIn'
import Client from '../models/Client'
import Admin from '../models/Admin'
import Coffre from '../models/Coffre'

const renouvellement = Router()

renouvellement.put('/change_status_renew', async (req, res) => {
  logger.info("Appel PUT /change_status_renew")
  const transaction = await sequelize.transaction()
  try {
    const demand = JSON.parse(req.body.demand)
    if(!demand){
      logger.error("Données manquantes de la demande à modifier dans la requête.")
      return res.status(400).send({ error: "Données manquantes dans la requête." })
    }
    const user = req.user instanceof Client ? req.user as Client : req.user as Admin

    if(req.user instanceof Admin){
      const renouvellement = await Renouvellement.update({ status: demand.status, info: demand.info }, { where: {id: demand.id }, transaction})
      if (renouvellement[0] === 0) {
        throw new Error(`Impossible de modifier le statut du renouvellement.`)
      }

    } else {
      logger.error(`Cette action n\'est pas autorisée par ${user.id}.`)
      throw new Error(`Cet utilisateur n\'est pas autorisé à modifier la demande n° ${demand.id}`)
    }

    await transaction.commit()        
    res.send({ success: 'Statut changé avec sucess.'  })
  } catch (e) {
    await transaction.rollback()
    const messageTechnique = "Anomalie technique survenue lors de la modification du statut d'une demande de renouvellement"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
})

renouvellement.post('/all_renew_request', userLoggedIn, async (req, res) => {
  logger.info("Appel POST /all_renew_request")
  try {
    const user = req.user instanceof Client ? req.user as Client : req.user as Admin

    let renouvellement = null
    if(user instanceof Client){
      logger.debug(`Recherche des demandes de renouvellement pour le client ${user.clientNumber}.`)
      renouvellement = await Renouvellement.findAll({ where: { ownerId: user.id}})
    } else {
      logger.debug(`Recherche des demandes de renouvellement par l'administrateur n° ID ${user.id}.`)
      renouvellement = await Renouvellement.findAll({order: [["createdAt", "DESC"]], include: [{ model: Client, attributes: ["clientNumber"] } ]})
    }

    res.send({ results: renouvellement })
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors de la récupération des demandes de renouvellement"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
})

renouvellement.post('/renew_anonymous', async (req, res) => {
    logger.info("Appel POST /renew_anonymous")
    const transaction = await sequelize.transaction()
    try {
      const userData = req.body
      if(!userData){
        logger.error("Données manquantes dans la demande de renouvellement.")
        return res.status(400).send({ error: "Données manquantes dans la demande de renouvellement." })
      }
      
      const client = await Client.findOne({ where: { email: userData.email } })
      if (!client) {
        logger.error(`Aucun client trouvé avec l'email ${userData.email}.`)
        throw new Error('Aucun compte trouvé avec l\'email fournit.')
      }

      const renouvellement = await Renouvellement.create({ type: userData.documentType, status: STATUS.EN_COURS, ownerId: client.id} , { transaction })
      if(!renouvellement){
        logger.error(`Impossible de créer le renouvellement en table pour l'email ${userData.email}.`)
      }
  
      if(userData.documentNumber){
        const lockdocument = {type: userData.documentType, number: userData.documentNumber, email: userData.email}
        const coffre = await Coffre.create(lockdocument, { transaction });
  
        if (!coffre)
          logger.error(`Anomalie lors de la sauvegarde du document n° ${userData.documentNumber} dans le coffre.`)
      }

      logger.debug(`Préparation de l'envoi de confirmation email à ${userData.email}.`)      
      await sendEmailRecapRenewDocument(userData, userData.email).then((err: any) => {if(err){
        throw new Error(err)
      }})
  
      await transaction.commit()        
      res.status(201).send({ success: `Un email récapitulatif de votre demande a été envoyé à ${userData.email}.`  })
    } catch (e) {
      await transaction.rollback()
      const messageTechnique = "Anomalie technique survenue lors de la création de la demande de renouvellement"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  })

  renouvellement.post('/renew', userLoggedIn, async (req, res) => {
    logger.info("Appel POST /renew")
    const transaction = await sequelize.transaction()
    try {
        const client = req.user as Client
        const result = await Client.findOne({ where: { id: client.id } })
        if (!result) {
          logger.error(`Aucun client ${client.clientNumber} trouvé.`)
          return res.status(404).json({ success: false })
        }
        
        const userData = JSON.parse(req.body.data)
        if(!userData){
          logger.error("Données manquantes dans la demande de renouvellement.")
          return res.status(400).send({ error: "Données manquantes dans la demande de renouvellement." })
        }

        const email = client.email       
        const renouvellement = await Renouvellement.create({ type: userData.documentType, status: STATUS.EN_COURS, ownerId: client.id} , { transaction })
        if(!renouvellement){
            logger.error(`Impossible de créer le renouvellement en table pour l'email ${email}.`)
        }

        if(userData.documentNumber){
          const lockdocument = {type: userData.documentType, number: userData.documentNumber, email: email}
          const coffre = await Coffre.create(lockdocument, { transaction });
    
          if (!coffre)
            logger.error(`Anomalie lors de la sauvegarde du document n° ${userData.documentNumber} dans le coffre.`)
        }

      logger.debug(`Préparation de l'envoi de confirmation email à ${email}.`)      
      await sendEmailRecapRenewDocument(userData, email).then((err: any) => {if(err){
        throw new Error(err)
      }})
  
      await transaction.commit()        
      res.status(201).send({ success: `Un email récapitulatif de votre demande a été envoyé à ${email}.`  })
    } catch (e) {
      await transaction.rollback()
      const messageTechnique = "Anomalie technique survenue lors de la création de la demande de renouvellement"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  })

export default renouvellement;
