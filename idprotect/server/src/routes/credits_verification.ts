import logger from '../config/logger'
import { Router } from "express";
import { userLoggedIn } from "../middlewares/isLoggedIn";
import Client from '../models/Client';
import { PaymentLog } from '../models/PaymentLog';
import sequelize from '../init/database';

const creditsVerification = Router()

creditsVerification.post('/add_credits', userLoggedIn, async (req, res) => {
  try {
    const client = req.user as Client

    const { amount, credits } = req.body

    if (!amount || !credits) {
      return res.status(400).json({ error: "Incorrect amount sent" })
    }

    await PaymentLog.create({ amount: parseInt(amount), addedCredits: parseInt(credits), issuerId: client.id })

    await Client.update({ credits: client.credits + parseInt(credits) }, { where: { id: client.id } })

    return res.status(200).json({ newCreditsAmount: client.credits })
  } catch(e) {
    console.log(e)
    const messageTechnique = "Anomalie technique survenue la préparation de l'ajout de crédits à votre compte"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
})

export { creditsVerification };