import logger from '../config/logger';
import { Router } from 'express';
import sequelize from '../init/database';
import { userLoggedIn } from '../middlewares/isLoggedIn';

import Admin from '../models/Admin';
import Client from '../models/Client';
import Coffre from '../models/Coffre';
import Perte from '../models/Perte';

const coffre = Router();

coffre.get('/lockdocument_anonymous/:id', async (req, res) => {
  logger.info('Appel GET /lockdocument_anonymous/:id')
  try {   
    const id = req.params.id
    if(!id){
      logger.error('Le numéro de document est absent dans la requête.');
      return res.status(400).send({ error: 'Le numéro de document est absent dans la requête.' });
    }

    logger.debug(`Recherche du document ${id} dans le coffre.`);
    const document = await Coffre.findOne({ where: { number: id } });

    logger.debug(`Recherche du numéro de document ${id} dans les documents perdus.`);
    const perte = await Perte.findOne({ where: { number: id } });

    if(document === null && perte === null){
      logger.error(`Document n° ${id} non enregistré.`)
      return res.send({ success: true });
    }

    res.send({ success: false });
  } catch (e) {
    logger.error(`Recherche d'un document dans le coffre: ${e.message}`);
    res.status(500).send({ error: 'Anomalie lors de la recherche du document dans le coffre.' });
  }
});

coffre.post('/lockdocument/:id', userLoggedIn, async (req, res) => {
  logger.info('Appel POST /lockdocument/:id')
  try {   
    const id = req.params.id
    if(!id){
      logger.error('Le numéro de document est absent dans la requête.');
      return res.status(400).send({ error: 'Le numéro de document est absent dans la requête.' });
    }

    const user = req.user instanceof Admin ? req.user as Admin : req.user as Client

    logger.debug(`Recherche du numéro de document ${id} dans le coffre par l'utilisateur n° ${user.id} ${user.email}.`);
    const document = await Coffre.findOne({ where: { number: id } });

    logger.debug(`Recherche du numéro de document ${id} dans les documents perdus.`);
    const perte = await Perte.findOne({ where: { number: id } });

    if(document === null && perte === null){
      logger.error(`Document n° ${id} non enregistré.`)
      return res.send({ success: true });
    }

    res.send({ success: false });
  } catch (e) {
    const messageTechnique = 'Anomalie technique lors de la recherche du document dans le coffre'
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
});

coffre.post('/lockdocuments', userLoggedIn, async (req, res) => {
  logger.info('Appel POST /lockdocuments')
  try {
    const admin = req.user as Admin
    logger.debug(`Récupération des documents du coffre par l'admin n° ${admin.id}`)

    const documents = await Coffre.findAll({ order: [['createdAt', 'DESC']] });

    res.send({ documents });
  } catch (e) {
    const messageTechnique = 'Anomalie technique lors de la recherche de tous les documents dans le coffre'
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
});

coffre.post('/lockdocument', userLoggedIn, async (req, res) => {
  logger.info('Appel POST /lockdocument')
  const transaction = await sequelize.transaction();
  try {
    if(!req.body.lockdocument){
      logger.error('Le document est absent de la requête.');
      return res.status(400).send({ error: 'Le document est absent de la requête.' });
    }

    const admin = req.user as Admin
    logger.debug(`Ajout du document dans le coffre par l'admin n° ${admin.id}`)
  
    const document = JSON.parse(req.body.lockdocument);
    const result = await Coffre.create(document, { transaction });

    if (!result)
      throw new Error("Anomalie lors de l'ajout du document dans le coffre en mode anonyme.")

    await transaction.commit();
    res.status(201).send({ success: 'success' });
  } catch (e) {
    await transaction.rollback();
    const messageTechnique = "Anomalie technique survenue lors de l'ajout du document dans le coffre"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
});

coffre.put('/lockdocument', userLoggedIn, async (req, res) => {
  logger.info('Appel PUT /lockdocument')
  const transaction = await sequelize.transaction();
  try {
    if(!req.body.lockdocument){
      logger.error('Le document est absent dans la requête.')
      return res.status(400).send({error: 'Le document est absent dans la requête.'})
    }

    const admin = req.user as Admin
    logger.debug(`Modification du document dans le coffre par l'admin n° ${admin.id}`)
    
    const lockdocument = JSON.parse(req.body.lockdocument)
    const lockdocumentExist = await Coffre.findOne({ where: { number: lockdocument.number } })
    if(lockdocumentExist && lockdocumentExist.id !== lockdocument.id){
      return res.status(400).send({ error: 'Ce numéro existe déjà.'})
    }

    const result = await Coffre.update(lockdocument, { where: { id: lockdocument.id }, transaction }) 

    if(result[0] === 0)
      throw new Error('Anomalie de mise à jour.')

    await transaction.commit();
    res.send({ success: 'success' });
  } catch (e) {
    await transaction.rollback();
    const messageTechnique = 'Anomalie technique survenue lors de la mise à jour du document dans le coffre'
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
});

coffre.delete('/lockdocument/:id', userLoggedIn, async (req, res) => {
  logger.info('Appel DELETE /lockdocument/:id')
  const transaction = await sequelize.transaction();
  try {  
    const id = req.params.id
    if(!id){
      logger.error("L'identifiant est absent dans la requête.")
      return res.status(400).send({error: "L'identifiant est absent dans la requête."})
    }

    const admin = req.user as Admin
    logger.debug(`Suppression du document n° ${id} dans le coffre par l'admin n° ${admin.id}`)
    const result = await Coffre.destroy({ where: { id }, transaction })  

    if(result === 0)
      throw new Error('Anomalie de suppression.')

    await transaction.commit();
    res.send({ success: 'Supression effectuée avec succès.' });
  } catch (e) {
    await transaction.rollback();
    const messageTechnique = 'Anomalie technique survenue lors de la suppression du document dans le coffre'
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
});

export default coffre;
