import { Router } from "express";
import logger from '../config/logger';
import { userLoggedIn } from "../middlewares/isLoggedIn";
import Client from "../models/Client";
import Document from "../models/Document";
import { FollowedDocument } from "../models/FollowedDocument";
import Perte from "../models/Perte";

const followedDocuments = Router()

followedDocuments.post('/followeddocuments/get-documents', userLoggedIn, async (req, res) => {
  logger.info("Requête POST à l'url /followeddocuments/get-documents")
  try {
    const client = req.user as Client;

    const followedDocuments = await FollowedDocument.findAll({
      where: { userId: client.id },
      // include: [Perte]
    })

    return res.status(200).json(followedDocuments)
  } catch(e) {
    const messageTechnique = 'Anomalie technique survenue lors de la création de la demande'
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({error: messageTechnique})
  }
})

followedDocuments.post('/followeddocuments/delete', userLoggedIn, async (req, res)  => {
  try {
    const followedDocument = await FollowedDocument.findOne({ where: { id: req.body.documentId } })
    if (!followedDocument) {
      return res.status(404).json({ error: "Ce document n'existe pas" })
    }

    await followedDocument.destroy()

    return res.status(200).json({ message: "Le document à bien été supprimé" })
  } catch (error) {
    const messageTechnique = 'Anomalie technique survenue lors de la création de la demande'
    logger.error(`${messageTechnique} : ${error.message}.`)
    return res.status(500).json({error: messageTechnique})
  }
})

followedDocuments.post('/followeddocuments', userLoggedIn, async (req, res) => {
  try {
    const { documentId, documentType } = req.body;
    
    const client = req.user as Client
    
    const alreadyInsertedDocument = await FollowedDocument.findOne({ where: { number: documentId } })
    if (alreadyInsertedDocument) {
      return res.status(409).json({ error: "Ce document est déjà suivi !" })
    }

    const followedDocument = await FollowedDocument.create({
      number: documentId,
      type: documentType,
      userId: client.id,
    })

    return res.status(200).json(followedDocument)
  } catch(e) {
    const messageTechnique = 'Anomalie technique survenue lors de la création de la demande'
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({error: messageTechnique})
  }
})




export { followedDocuments }
