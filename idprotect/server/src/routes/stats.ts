import logger from "../config/logger";
import { Router } from "express";
import { fn, QueryTypes  } from "sequelize";
import sequelize from "../init/database";
import { userLoggedIn } from "../middlewares/isLoggedIn";
import Admin from "../models/Admin";
import Client from "../models/Client";
import Perte from "../models/Perte";
import Renouvellement from "../models/Renouvellement";
import Coffre from "../models/Coffre"

const stats = Router()

stats.post("/alertes", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /alertes")
  try {
    const admin = req.user as Admin
    logger.debug("Récupération du nombre des alertes par l'administrateur.");

    const count = await sequelize.query('SELECT count(*) FROM alertes', {plain: false, raw: false, type: QueryTypes.SELECT});

    res.send({ count });
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors du decompte des alertes"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
});

stats.post("/client_documents", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /client_documents")
  try {
    const admin = req.user as Admin
    logger.debug("Récupération du nombre de documents par l'administrateur.");

    const count = await sequelize.query('SELECT count(*) FROM clientdocuments', {plain: false, raw: false, type: QueryTypes.SELECT});

    res.send({ count });
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors du decompte des documents"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
});

stats.post("/client_folder_authorizations", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /client_folder_authorizations")
  try {
    const admin = req.user as Admin
    logger.debug("Récupération du nombre d'autorisations par l'administrateur.");

    const count = await sequelize.query('SELECT count(*) FROM clientfolderauthorizations', {plain: false, raw: false, type: QueryTypes.SELECT});

    res.send({ count });
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors du decompte des autorisations"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
});

stats.post("/clients_folders", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /clients_folders")
  try {
    const admin = req.user as Admin
    logger.debug("Récupération du nombre de dossiers par l'administrateur.");

    const count = await sequelize.query('SELECT count(*) FROM clientsfolders', {plain: false, raw: false, type: QueryTypes.SELECT});

    res.send({ count });
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors du decompte des dossiers clients"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
});

stats.post("/clients_per_month", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /clients_per_month")
  try {
    const admin = req.user as Admin
    logger.debug("Récupération des clients par mois par l'administrateur.");

    const results = await sequelize.query("SELECT YEAR(createdAt) AS year, DATE_FORMAT(createdAt, '%b') AS week, COUNT(*) AS total FROM Clients GROUP BY Year, Week", { type: QueryTypes.SELECT });

    res.send({ results });
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors de la recherche des clients par mois"
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
});

stats.post("/clients", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /clients")
  try {
      const admin = req.user as Admin
      logger.debug("Récupération des clients par l'administrateur.");
  
      const results = await Client.findAll({attributes: ["type", [fn('COUNT', 'type'), 'count']], group: 'type'});
  
      res.send({ results });
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors du decompte des clients"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  });

  stats.post("/coffres", userLoggedIn, async (req, res) => {
    logger.info("Appel POST /coffres")
    try {
      const admin = req.user as Admin
      logger.debug("Récupération des documents du coffre par l'administrateur.");

      const count = await sequelize.query('SELECT count(*) FROM coffres', {plain: false, raw: false, type: QueryTypes.SELECT});
  
      res.send({ count });
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors du decompte des documents du coffre"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  });

  stats.post("/pertes", userLoggedIn, async (req, res) => {
    logger.info("Appel POST /pertes")
    try {
      const admin = req.user as Admin
      logger.debug("Récupération des documents perdus par l'administrateur.");

      const results = await Perte.findAll({attributes: ["type", [fn('COUNT', 'type'), 'count']], group: 'type'});
  
      res.send({ results });
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors du decompte des documents perdus"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  });

  stats.post("/positions", userLoggedIn, async (req, res) => {
    logger.info("Appel POST /positions")
    try {
      const admin = req.user as Admin
      logger.debug("Décompte des positions par l'administrateur.");
  
      const count = await sequelize.query('SELECT count(*) FROM positions', {plain: false, raw: false, type: QueryTypes.SELECT});
  
      res.send({ count });
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors du decompte des positions"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  }); 

  stats.post("/renouvellements", userLoggedIn, async (req, res) => {
    logger.info("Appel POST /renouvellements")
    try {
      logger.debug("Récupération des renouvellements par l'administrateur.");
      const admin = req.user as Admin

      const types = await Renouvellement.findAll({attributes: ["type", [fn('COUNT', 'type'), 'count']], group: 'type'});
      const status = await Renouvellement.findAll({attributes: ["status", [fn('COUNT', 'status'), 'count']], group: 'status'});

      res.send({ types, status });
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors de la recherche des renouvellements"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  });

  stats.post("/sessions", userLoggedIn, async (req, res) => {
    logger.info("Appel POST /sessions")
    try {
      const admin = req.user as Admin
      logger.debug("Décompte des sessions par l'administrateur.");
  
      const count = await sequelize.query('SELECT count(*) as count FROM sessions', {plain: false, raw: false, type: QueryTypes.SELECT});
  
      res.send({ count });
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors du decompte des sessions"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  });

  stats.post("/token_verifications", userLoggedIn, async (req, res) => {
    logger.info("Appel POST /token_verifications")
    try {
      const admin = req.user as Admin
      logger.debug("Décompte des tokens vérifications par l'administrateur.");
  
      const results = await sequelize.query("SELECT YEAR(createdAt) AS year, DATE_FORMAT(createdAt, '%b') AS month, COUNT(*) AS total FROM tokenverifications GROUP BY Year, Month", { type: QueryTypes.SELECT });

      res.send({ results });
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors du decompte des tokens vérifications"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  });

  stats.post("/notifications", userLoggedIn, async (req, res) => {
    logger.info("Appel POST /notifications")
    try {
      const admin = req.user as Admin
      logger.debug("Décompte des notifications par l'administrateur.");
  
      const count = await sequelize.query('SELECT count(*) FROM notifications', {plain: false, raw: false, type: QueryTypes.SELECT});
  
      res.send({ count });
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors du decompte des notifications"
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({ error: messageTechnique })
    }
  });

  export default stats