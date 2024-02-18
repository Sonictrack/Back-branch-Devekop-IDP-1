import fs from "fs"
import logger from '../config/logger';
import { Router } from "express";
import { userLoggedIn } from "../middlewares/isLoggedIn";
import Document from '../models/Document';
import Folder from '../models/Folder';
import DocumentAuthorizationRequest from '../models/DocumentAuthorizationRequest';
import { sendEmailDocumentRequest, sendEmailDocumentRequestNewStatus } from '../utils/ovh-email';
import Client from '../models/Client';
import { FollowedDocument } from '../models/FollowedDocument';
import Perte from "../models/Perte";

const documentViewRequests = Router()

documentViewRequests.post('/documentrequests', async (req, res) => {
    logger.info('Appel POST /documentrequests');

    try {
      const { id } = req.user as Client;
      const { documentId } = req.body;

      // const document = await Perte.findOne({ where: { number: documentId } })
      // if (!document) {
        // return res.status(200).json({ message: "Aucun document n'a été trouvé !" })
      // }

      const followedDocument = await FollowedDocument.findOne({ where: { number: documentId }, include: [ Client ] })
      if (!followedDocument) {
        return res.status(200).json({ message: "Aucun document suivi n'a été trouvé !" })
      }

      // Create the request in the db
      const documentRequest = await DocumentAuthorizationRequest.create({
        documentNumber: documentId,
        clientId: followedDocument?.userId,
        professionalId: id,
        documentId: followedDocument.get('id'),
        status: 'requested'
      })

      // Send the confirmation email
      await sendEmailDocumentRequest(followedDocument.user.email, { requestId: documentRequest.get('id') })

      return res.status(201).json(documentRequest)
    } catch(e) {
      const messageTechnique = 'Anomalie technique survenue lors de la création de la demande'
      logger.error(`${messageTechnique} : ${e.message}.`)
      return res.status(500).json({error: messageTechnique})
    }
})

documentViewRequests.post('/documentrequests/confirm', async (req, res) => {
  logger.info('Appel POST /documentrequests/confirm');

  try {
    const { requestId, status }: any = req.query

    if (!requestId || !status || !["confirm", "reject"].includes(status)) {
      return res.status(400).json({ error: "Cette requête est invalide" })
    }
    
    const request = await DocumentAuthorizationRequest.findOne({ where: { id: requestId } })

    if (!request || request.status !== 'requested') {
      return res.status(400).json({ error: "Cette demande à déjà été traitée" })
    }

    await DocumentAuthorizationRequest.update({ status }, { where: { id: requestId } })

    const receiver = await Client.findOne({ where: { id: request.professionalId } })

    if (!receiver) {
      return res.status(404).json({ error: "L'utilisateur à l'origine de la demande n'a pas été trouvé" })
    }

    // Send an email to the professional
    // await sendEmailDocumentRequestNewStatus(receiver.email, { requestId: request.documentId, status: request.status })

    return res.status(200).json(request)
  } catch(e) {
    const messageTechnique = 'Anomalie technique survenue lors de la confirmation de la demande'
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
})

documentViewRequests.post('/documentrequests/document', userLoggedIn, async (req, res) => {
  logger.info("Appel POST /documentrequests/document")

  try {
    const { requestId }: any = req.query

    if (!requestId) {
      return res.status(400).json({ error: "Cette requête est invalide" })
    }
    
    const request = await DocumentAuthorizationRequest.findOne({ where: { id: requestId } })
    
    if (!request) {
      return res.status(404).json({ error: "Cette demande n'existe pas" })
    }

    const document = await Perte.findOne({ where: { id: request.documentId } })

    if (!document) {
      return res.status(404).json({ error: "Ce document n'existe pas" })
    }

    const base64Document = fs.readFileSync(document.idPath, { encoding: "base64" })

    return res.status(200).json({ document: base64Document })
  } catch(e) {
    const messageTechnique = 'Anomalie technique survenue lors de la confirmation de la demande'
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique })
  }
})

documentViewRequests.post('/documentrequests/handshake', userLoggedIn, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Veuillez renseigner l' identifiant unique du document document" });
    }

    const request = await DocumentAuthorizationRequest.findOne({ where: { id: id } })

    if (!request) {
      return res.status(404).json({ error: "Cette demande n'existe pas !" })
    }

    return res.status(200).json({ request })
  } catch(e) {
    const messageTechnique = 'Anomalie technique survenue lors de l\'exécution de la demande'
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique }) 
  }
})

documentViewRequests.post('/documentrequests/list', userLoggedIn, async (req, res) => {
  try {
    const { id } = req.user as Client

    const requests = await DocumentAuthorizationRequest.findAll({ where: { professionalId: id } })

    if (!requests) {
      return res.status(404).json({ error: "Cette demande n'existe pas !" })
    }

    return res.status(200).json({ requests: requests })
  } catch(e) {
    const messageTechnique = 'Anomalie technique survenue lors de l\'exécution de la demande'
    logger.error(`${messageTechnique} : ${e.message}.`)
    return res.status(500).json({ error: messageTechnique }) 
  }
})

export { documentViewRequests }