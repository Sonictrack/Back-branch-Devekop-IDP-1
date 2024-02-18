import logger from "../config/logger";
import { Router } from "express";
import sequelize from "../init/database";
import { Op } from "sequelize";
import { userLoggedIn } from "../middlewares/isLoggedIn";
import Client from "../models/Client";
import Admin from "../models/Admin";
import Notification from "../models/Notification";

const notification = Router()

notification.post("/notifications", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /notifications")
  try {
    const user = req.user instanceof Client ? req.user as Client : req.user as Admin
    if(!user)
      throw new Error('User non renseigné')

    const from = user instanceof Client ? user.clientNumber : "ADMIN"
    logger.debug(`Recherche des notifications de l'utilisateur ${from}`)
    const notifications = 
    await Notification.findAll({ where: { [Op.or]: [{ from: from }, { to: from }] }, order: [["createdAt", "DESC"]] })

    res.send({ notifications })
  } catch (e) {
    const messageTechnique = "Anomalie technqiue survenue lors de la récupération des notifications"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
});

notification.post("/notification", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /notification")
  const transaction = await sequelize.transaction();
  try {
    const user = req.user instanceof Client ? req.user as Client : req.user as Admin
    if(!user)
      throw new Error('User non renseigné')
    
    const from = user instanceof Client ? user.clientNumber : "ADMIN"
    logger.debug(`Enregistrement d'une notification pour l'utilsiateur ${from}.`);
    const notification = JSON.parse(req.body.notification);

    const result = await Notification.create({action: notification.action, from: from, to: notification.to, detail: notification.detail, ownerId: user.id}, { transaction })
    if (!result) {
      logger.error(`Anomalie lors la création de la notification pour le user ${from}.`)
      return res.status(500).send({error: "Anomalie survenue lors de la création de la notification."})
    }

    await transaction.commit();
    res.status(201).send({ success: "success" });
  } catch (e) {
    await transaction.rollback();
    const messageTechnique = "Anomalie technique survenue lors de la création de la notification"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
});

export default notification;
