import logger from "../config/logger";
import { Router } from "express";
import sequelize from "../init/database";
import { userLoggedIn } from "../middlewares/isLoggedIn";

import Client from "../models/Client";
import Position from "../models/Position";

const position = Router();

position.post("/positions", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /positions")
  try {
  const client = req.user as Client
  const clientNumber = client.clientNumber
  logger.debug(`Recherche des positions du client ${clientNumber}.`);
    let positions = await Position.findAll({
      where: { to: clientNumber },
      order: [["createdAt", "DESC"]],
    });

    res.send({ positions });
  } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors de la récupération des données de géolocalisation"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
  }
});

position.post("/position", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /position")
  const transaction = await sequelize.transaction();
  try {
    const client = req.user as Client;
    const clientNumber = client.clientNumber
    logger.debug(`Enregistrement de la position du client ${clientNumber}.`);
    let { latitude, longitude, to, action } = JSON.parse(req.body.position);

    let result = await Position.create( { latitude, longitude, from: clientNumber, to, action }, { transaction });
    if (!result)
      throw new Error("Anomalie survenue lors de la création de la géolocalisation.")

    await transaction.commit();
    res.status(201).send({ success: "success" });
  } catch (e) {
    await transaction.rollback();
    const messageTechnique = "Anomalie technique survenue lors de l'enregistrement de la position géographique"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
});

export default position;
