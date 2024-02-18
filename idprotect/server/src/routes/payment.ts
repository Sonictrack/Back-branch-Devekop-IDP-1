import logger from '../config/logger'
import { Router } from 'express'
import { sendEmailPayment } from '../utils/ovh-email'
import Client from '../models/Client'
import { userLoggedIn } from '../middlewares/isLoggedIn'
import Stripe from 'stripe'
import { PaymentLog } from '../models/PaymentLog'

const payment = Router()

payment.post('/payment_anonymous', async (req, res) => {
    logger.info("Appel POST /payment_anonymous")
    try {
      if(!req.body.email && !req.body.amount){
        logger.error("Aucun email et/ou montant n'est présent dans la requête du client.")
        return res.status(400).json({ error: "Des données sont manquantes pour traiter la demande." })
      }
    
      const email = req.body.email
     
      logger.debug(`Préparation de l'envoi de confirmation du paiement à ${email}.`)
      const amount = req.body.amount
    
      await sendEmailPayment(email, amount).then((err: any) => {if(err){
        throw new Error(err)
      }})

      res.json({ success: `Paiement réussi! Un email de confirmation a été envoyé à ${email}.` })
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors de l'envoie de la confirmation du paiement"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  })

  payment.post('/payment', userLoggedIn, async (req, res) => {
    logger.info("Appel POST /payment")
    try {
    logger.debug("Confirmation de paiement par email en mode connecté.")
    const client = req.user as Client
      if(!req.body.amount){
        logger.error("Aucun montant n'est présent dans la requête du client.")
        return res.status(400).json({ error: "Le montant est manquant pour traiter la demande." })
      }

      const result = await Client.findOne({ where: { id: client.id } })
      if (!result) {
        logger.error(`Aucun client ${client.clientNumber} trouvé.`)
        return res.status(404).json({ success: false })
      }
    
      const email = client.email  
     
      logger.debug(`Préparation de l'envoi de confirmation du paiement à ${email}.`)

      const amount = req.body.amount
 
      await sendEmailPayment(email, amount).then((err: any) => {if(err){
        throw new Error(err)
      }})

      res.json({ success: `Paiement réussi! Un email de confirmation a été envoyé à ${email}.` })
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors de l'envoie de la confirmation du paiement"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  })

  payment.post('/payment_intent', async (req, res) => {
    logger.info("Appel POST /payment_intent")
    try {
      const intent = req.body
      if(!intent){
        logger.error("Données manquantes dans l'intention de paiement.")
        return res.status(400).send({ error: "Données manquantes dans l'intention de paiement." })
      }
  
      const secretKey = process.env.STRIPE_SK as string
      const stripe = new Stripe(secretKey, { apiVersion: '2020-08-27', typescript: true })

      const paymentIntent = await stripe.paymentIntents.create({
        // Stripe transforme XXX en X.XX d'ou le besoin de * par 100
        amount: Math.round(intent.amount * 100),
        currency: intent.currency,
        description: intent.description,
        statement_descriptor: intent.statement_descriptor
      })
  
      const publicKey = process.env.STRIPE_PK as string
      res.status(201).json({ clientSecret: paymentIntent.client_secret, publicKey  })
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue la préparation de l'intention de paiement"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  })

  // payment.post('/session_checkout', async (req, res) => {
  //   logger.info("Appel POST /session_checkout")
  //   try {
  //     const intent = req.body
  //     if(!intent){
  //       logger.error("Données manquantes dans l'intention de paiement.")
  //       return res.status(400).send({ error: "Données manquantes dans l'intention de paiement." })
  //     }
  
  //     const secretKey = process.env.STRIPE_SK as string
  //     const stripe = new Stripe(secretKey, { apiVersion: '2020-03-02' })
      
  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ['card'],
  //       line_items: [{
  //         name: intent.name,
  //         description: intent.description,
  //         amount: intent.amount * 100,
  //         currency: intent.currency,
  //         quantity: intent.quantity
  //       }],
  //       success_url: `${req.protocol}://localhost:3000/commons/paiement`,
  //       cancel_url: `${req.protocol}://localhost:3000/commons/paiement`
  //     })

  //     const publicKey = process.env.STRIPE_PK as string
  
  //     res.json({ id: session.id, publicKey });
  //   } catch (e) {
  //     const messageTechnique = "Anomalie technique survenue lors de la préparation du paiement"
  //     logger.error(`${messageTechnique} : ${e.message}.`)
  //     return res.status(500).json({ error: messageTechnique })
  //   }
  // })

  payment.post('/payment_logs', userLoggedIn, async (req, res) => {
    try {
      const client = req.user as Client

      const payments = await PaymentLog.findAll({ where: { issuerId: client.id } })

      return res.status(200).json({ payments })
    } catch(e) {
      const messageTechnique = "Anomalie technique survenue lors de la récupération des paiements"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  })

  export default payment;