import logger from '../config/logger'
import { Router } from 'express'
import Cryptr from 'cryptr'
import bcrypt from "bcryptjs"
import sequelize from '../init/database'
import { sendEmail } from '../utils/ovh-email'
import { EMAIL_ACTION } from '../utils/enums'
import TokenVerification from '../models/TokenVerification'
import Client from '../models/Client'

const cryptr = new Cryptr(process.env.CRYPTO_SECRET_KEY as string) 

const email = Router()

email.post('/check_email', async (req, res) => {
  logger.info("Appel POST /check_email")
  try {
    const email = req.body.email
    if(!email){
      logger.error("Aucun email n'est présent dans la requête du client.")
      return res.status(400).json({ error: "L'email est manquant pour traiter la demande." })
    }

    const client = await Client.findOne({ where: { email } })
  
    if (client) {
      logger.error(`Un client trouvé avec l'email ${email}.`)
      return res.status(404).json({ error: "Cet email est déjà utilisé." })
    }

    res.send({ success: "Cet email n'est pas utilisé."  })   
  } catch (e) {
    logger.error(`Anomalie survenue lors la vérification de l'utilisation de l'email : ${e.message}.`)
    res.status(500).send({ error: "Anomalie survenue lors la vérification de l'utilisation de l'email." })
  }
})

email.post('/password', async (req, res) => {
    logger.info("Appel POST /password")
    const transaction = await sequelize.transaction()
    try {
    
      if(!req.body.token && !req.body.password){
        logger.error("Aucun email et/ ou mot de passe n'est présent dans la requête du client.")
        return res.status(400).json({ error: "Des données sont manquantes pour traiter la demande." })
      }
  
      const token = req.body.token
      if(!token){
        logger.error("Aucun token n'est présent dans la requête du client.")
        return res.status(400).json({ error: "Impossible de vérifier votre compte avec le lien envoyé." })
      }
    
      const tokenResult = await TokenVerification.findOne({ where: { token } })
      const timerToken = Number(process.env.TIME_TOKEN_VERIFICATION)

      if(!tokenResult || new Date().getTime() > tokenResult.createdAt.getTime() + timerToken ){
        logger.error(`Le token ${token} n'existe pas dans le système ou bien a expiré.`)
        return res.status(400).json({ error: "Ce lien n'est plus valide. Veuillez refaire une demande de mot de passe oublié!" })
      }
  
      const email = cryptr.decrypt(token)
  
      const client = await Client.findOne({ where: { email } })    
      if (!client) {
        logger.error(`Aucun client trouvé avec l'email ${email}.`)
        return res.status(404).json({ error: "Aucun compte client n'est associé à cet email." })
      }
  
      if(!client.isVerified){
        logger.debug(`Client ${client.clientNumber} non vérifié!`)
        return res.status(400).json({ error: "Vous n'avez toujours pas confirmer votre compte. Veuillez vérifier votre boite email ou faire une demander de vérification de comtpe." })
      }
  
      await TokenVerification.destroy({ where: { userId: client.clientNumber }, transaction })
  
      const password = req.body.password
      const result = await Client.update({ password: bcrypt.hashSync(password, 10), suspended: 0, numberAttempt: 3 }, { where: { id: client.id }, transaction }) 
      if(result[0] === 0){
        logger.error(`Anomalie survenue lors de la mise à jour de la mise à jour du mot de passe du compte ${client.clientNumber}.`)
        return res.status(500).send({ error: "Anomalie survenue lors de la mise à jour du mot de passe." })
      }
  
      await transaction.commit()
      res.send({ success: 'Le mot de passe a bien été modifié, vous pouvez à présent vous connecter.'  })    
    } catch (e) {
      await transaction.rollback()
      logger.error(`Anomalie survenue lors du renvoie de la modification du mot de passe client : ${e.message}.`)
      res.status(500).send({ error: "Anomalie survenue lors du renvoie de la modification du mot de passe client." })
    }
  })

email.post('/confirmation', async (req, res) => {
    logger.info("Appel POST /confirmation")
    try {
      const token = req.body.token
      if(!token){
        logger.error("Aucun token n'est présent dans la requête du client.")
        return res.status(400).json({ error: "Impossible de vérifier votre compte avec le lien envoyé." })
      }
    
      const tokenResult = await TokenVerification.findOne({where: { token }, order: [ [ 'id', 'DESC' ]]})
      const timerToken = Number(process.env.TIME_TOKEN_VERIFICATION)

      if(!tokenResult || new Date().getTime() > tokenResult.createdAt.getTime() + timerToken ){
        logger.error(`Le token ${token} n'existe pas dans le système ou bien il a expiré.`)
        return res.status(400).json({ error: "Ce lien n'est pas valide. Veuillez faire une nouvelle demande de vérification." })
      }
      const transaction = await sequelize.transaction()
      const tokenDestroyed = await TokenVerification.destroy({ where: { userId: tokenResult.userId }, transaction }) 
      if(tokenDestroyed === 0){
         logger.error(`Anomalie dans la suppression du token ${token} du compte ${tokenResult.userId}.`)
      }
  
      const client = await Client.findOne({ where: { clientNumber: tokenResult.userId } })
    
      if (!client) {
        logger.error(`Aucun client ${tokenResult.userId} trouvé.`)
        return res.status(404).json({ error: "Compte client inconnu." })
      }
  
      if(client.isVerified){
        logger.debug(`Client ${client.clientNumber} déjà vérifié!`)
        return res.status(400).json({ error: "Client déjà vérifié. Veuillez vous connecter!" })
      }
      
      try{
        client.isVerified = true
        const result = await Client.update({ isVerified: client.isVerified }, { where: { id: client.id }, transaction }) 
        if(result[0] === 0){
          logger.error(`Anomalie survenue lors de la mise à jour de la mise à jour de vérification du compte ${client.clientNumber}.`)
          return res.status(500).send({ error: "Anomalie survenue lors de la mise à jour de vérification du compte." })
        }
  
        await transaction.commit()
        res.send({ success: 'Le compte a bien été vérifié, vous pouvez à présent vous connecter.'  })
      } catch(e) {
        await transaction.rollback()  
        throw new Error(e)
      }
    } catch (e) {
      logger.error(`Anomalie survenue lors de la mise à jour de la mise à jour de vérification du compte : ${e.message}.`)
      res.status(500).send({ error: "Anomalie survenue lors de la mise à jour de la mise à jour de vérification du compte." })
    }
  })
  
  email.post('/resend', async (req, res) => {
    logger.info("Appel POST /resend")
    const transaction = await sequelize.transaction()
    try {
    
      if(!req.body.email && !req.body.action){
        logger.error("Aucun email et/ ou action n'est présent dans la requête du client.")
        return res.status(400).json({ error: "Des données sont manquantes pour traiter la demande." })
      }
    
      const email = req.body.email
      const client = await Client.findOne({ where: { email } })
      
      if (!client) {
        logger.error(`Aucun client trouvé avec l'email ${email}.`)
        return res.status(404).json({ error: "Aucun compte client n'est associé à cet email." })
      }
      
      const action = req.body.action
      if(client.isVerified && action === EMAIL_ACTION.VERIFY){
        logger.debug(`Client ${client.clientNumber} déjà vérifié!`)
        return res.status(400).json({ error: "Client déjà vérifié." })
      }
  
      const tokenDestroyed = await TokenVerification.destroy({ where: { userId: client.clientNumber }, transaction })
  
      logger.debug(`Création du token de vérification de création de compte pour l'email ${email}.`)
      const token = await TokenVerification.create( { userId: client.clientNumber, token: cryptr.encrypt(client.email) }, {transaction})
  
      if(!token){
        logger.error(`Anomalie survenue lors de la génération du token pour le client ${client.clientNumber}.`)
        return res.status(404).json({ error: "Anomalie survenue lors de la génération du token." })
      }
      
      logger.debug(`Préparation de l'envoi de confirmation email à ${client.email} pour le client ${client.clientNumber}.`)
      
      await sendEmail(client.email, token.token, action).then((err: any) => {if(err){
        throw new Error(err)
      }})
  
      await transaction.commit()
      res.json({ success: `Un email de confirmation a été envoyé à ${client.email}. Il sera valable 15 minutes` })
    } catch (e) {
      await transaction.rollback()
      logger.error(`Anomalie survenue lors du renvoie de la confirmation de compte au client : ${e.message}.`)
      res.status(500).send({ error: "Anomalie survenue lors du renvoie de la confirmation de compte." })
    }
  })

export default email;
