import logger from '../config/logger'
import { Router } from "express";
import { userLoggedIn } from "../middlewares/isLoggedIn";
import Client from '../models/Client';
import { PaymentLog } from '../models/PaymentLog';
import sequelize from '../init/database';
import Admin from '../models/Admin';

const creditsVerification = Router()

creditsVerification.post('/add_credits', userLoggedIn, async (req, res) => {
  try {
    const admin = req.user as Admin

    const { credits, email } = req.body

    if (!credits) {
      return res.status(400).json({ error: "Incorrect amount sent" })
    }

    const client = await Client.findOne({ where: { email } });

    if (!client) {
      return res.status(404).json({ error: "Cet utilisateur n'existe pas !" })
    }

    await PaymentLog.create({ amount: 0, addedCredits: parseInt(credits), issuerId: client.id })

    await Client.update({ credits: client.credits + parseInt(credits) }, { where: { id: client.id } })

    return res.status(200).json({ newCreditsAmount: client.credits })
  } catch(e) {
    console.log(e)
    const messageTechnique = "Anomalie technique survenue la préparation de l'ajout de crédits à ce compte"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
})

creditsVerification.post('/get_credits_history', userLoggedIn, async (req, res) => {
  try {
    const admin = req.user as Admin

    const logs = await PaymentLog.findAll({
      where: {
        amount: 0
      },
      include: [
        {
          model: Client,
          required: true,
        }
      ]
    });

    return res.status(200).json({ logs })
  } catch(e) {
    console.log(e)
    const messageTechnique = "Anomalie technique survenue la préparation de l'ajout de crédits à ce compte"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  } 
})

export { creditsVerification };