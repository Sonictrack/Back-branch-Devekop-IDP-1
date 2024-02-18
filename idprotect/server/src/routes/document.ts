import logger from '../config/logger'
import { Router } from 'express'
import sequelize from '../init/database'
import path from 'path'
import { UploadedFile } from '~/node_modules/@types/express-fileupload'
import stream from 'stream'

import { userLoggedIn } from '../middlewares/isLoggedIn'
import { DECLARATION } from '../utils/enums'
import { getExtension, getDecryptedFile } from '../utils/filesystem'

import Client from '../models/Client'
import Admin from '../models/Admin'
import Coffre from '../models/Coffre'
import Document, { DocumentResponse } from '../models/Document'
import Perte from '../models/Perte'
import { addFileToFolder, generateUuidFilename } from '../utils/filesystem'

const document = Router()

document.post('/document/:folderId/:docId', userLoggedIn, async (req, res) => {
  logger.info("Appel POST /document/:folderId/:docId")
  try{
    const dossierId = req.params.folderId
    const docId = req.params.docId
    if (!dossierId || !docId) {
      logger.error(`Des données sont manquantes dnas la requête du client.`)
      return res.status(400).send({ error: "Des données sont manquantes dnas la requête" })
    }

    const client = req.user as Client 
    const clientNumber = client.clientNumber
    logger.debug(`Récuperation du document n° ${docId} par le client n° ${clientNumber}`)

    const document = await Document.findOne({ where: { folderId: req.params.folderId, id: req.params.docId } })
    if (!document) {
      logger.error(`Récupération impossible du document n° ${docId} dans le dossier n° ${dossierId} par le client ${clientNumber}.`)
      return res.status(404).send({ error: "Ce document est introuvable" })
    }
      
    res.send({ url: document.path })
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors de la récupéreration du document"
      logger.error(`${messageTechnique} : ${e.message}.`)
      res.status(500).json({ error: messageTechnique })
    }
  })  
  
  document.post('/download_file', userLoggedIn, (req, res) => {
    logger.info("Appel POST /download_file")
    try{
      const filepath = req.body.filepath
      if (!filepath) {
        logger.error("Le chemin du fichier est manquant.")
        return res.status(400).send({ error: "Le chemin du fichier est manquant." })
      }
  
      logger.debug(`Chemin du document à récuperer ${filepath}.`)
      const filename = path.basename(filepath)
      logger.debug(`Nom du fichier recherché ${filename}.`)
      const buffer = getDecryptedFile(filepath);
      const readStream = new stream.PassThrough();
      readStream.end(buffer);
      res.writeHead(200, {
          "Content-disposition": "inline; filename=" + filename,
          "Content-Type": "application/octet-stream",
          "Content-Length": buffer.length
      });
      res.end(buffer);     
      
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors de la récupération du document"
      logger.error(`${messageTechnique} : ${e.message}.`)
      res.status(500).json({ error: messageTechnique })
    }
  })

  document.post('/get_lost_documents', userLoggedIn, async (req, res) => {
    logger.info("Appel POST /get_lost_documents")
    try {
      const user = req.user instanceof Client ? req.user as Client : req.user as Admin

      logger.debug(`Récuperation des documents perdus par l'utilisateur n° ${user.id}.`)
      let pieces = null
      if(user instanceof Client){
        pieces = await Perte.findAll({ where: { ownerId: user.id }, order: [['createdAt', 'DESC']], })
      } else {
        pieces = await Perte.findAll({ order: [['createdAt', 'DESC']], 
        include: [{ model: Client, attributes: ["clientNumber"] } ]})
      } 

    const results: Object[] = []
    if (pieces) {
      for (const piece of pieces) {
        const result = {
          typeDemande: piece.type,
          reason: piece.reason,
          numero: piece.number,
          createdAt: piece.createdAt,
          documentIdPath: piece.idPath,
          pvPath: piece.pvPath,
          clientNumber: piece.owner ? piece.owner.clientNumber : ''
        }
        results.push(result)
      }
    }

    res.json({ results: results })

  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors de la récupération des demandes"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

document.post('/search_lost_document', userLoggedIn, async (req, res) => {
  logger.info("Appel POST /search_lost_document")
  try {
        const client = req.user as Client
        const clientNumber = client.clientNumber
        logger.debug(`Recherche de pièces par le client ${clientNumber}.`)

        const cardNumber = req.body.number
        const docType = req.body.docType

        if (!cardNumber) {
          logger.error(`Le numéro du document recherché par le client ${clientNumber} est manquant.`)
          return res.status(400).json({ error: 'Numéro du document manquant!' })
        }
    
        // if (!docType) {
        //   logger.error(`Le type de document recherché par le client ${clientNumber} pour le document n° ${cardNumber} est manquant.`)
        //   return res.status(400).json({ error: 'Type du document manquant!' })
        // }
    
        // const piece = await Perte.findOne({ where : { number: cardNumber.toString(), type: docType.toString() }})
        const piece = await Perte.findOne({ where : { number: cardNumber.toString() }})
        if (!piece) {
          return res.json({ success: DocumentResponse.NotLostOrSloten})
        }
    
        const individual = await Client.findOne({where: {id: piece.ownerId}})
        if (!individual) {
          logger.error(`Client id n° ${piece.ownerId} non trouvé - type ${docType} - n° carte ${cardNumber} .`)
          return res.status(200).json({ error: DocumentResponse.NotFound })
        }

        res.status(200).json({ clientNumber: individual.clientNumber, error: DocumentResponse.LostOrSloten })

      } catch (e) {
        const messageTechnique = "Anomalie technique survenue lors de la recherche de la pièce d\'identité"
        logger.error(`${messageTechnique} : ${e.message}.`)
        res.status(500).json({ error: messageTechnique })
      }
    }
  )  

  document.post('/save_lost_documents',  userLoggedIn,  async (req, res) => {
    logger.info("Appel POST /save_lost_documents")
    const transaction = await sequelize.transaction()
    try {
      const client = req.user as Client

      const clientNumber = client.clientNumber
      logger.debug(`Déclaration de perte par le client ${clientNumber}.`)

      if (!req.body.idNumber || !req.files || !req.files.id || !req.files.pv) {
        logger.error(`Le numéro de la pièce ou les fichiers transmis sont manquants pour le client ${clientNumber}.`)
        return res.status(400).json({ error: 'Le numéro de la pièce ou les fichiers transmis sont manquants.' })
      }
      
      if (!req.body.docType) {
        logger.error(`Le type de pièce est manquante pour le client ${clientNumber}!`)
        return res.status(400).json({ error: 'Le type de pièce est manquante' })
      }

      const idNumber = req.body.idNumber
      const docType = req.body.docType
      const reason = req.body.reason
      const id = req.files.id as UploadedFile
      const pv = req.files.pv as UploadedFile
      
      const userID = clientNumber.toString() + path.sep + DECLARATION.PERTE
      const existingLockDocument = await Coffre.findOne({ where : {number: idNumber }})
      const existingDeclaration = await Perte.findOne({ where : {number: idNumber }})
      if(existingDeclaration || existingLockDocument){
        logger.error(`Déclaration déjà effectuée par le client ${clientNumber} pour la pièce n° ${idNumber}.`)
        return res.status(400).json({ error: `Déclaration déjà effectuée pour la pièce n° ${idNumber}.` })
      }

      const idNewfilename = generateUuidFilename(id.name);
      const relativeFileIdPath = path.join(client.clientNumber, DECLARATION.PERTE, idNewfilename)
      addFileToFolder(relativeFileIdPath, id)
      const pvNewfilename = generateUuidFilename(pv.name);
      const relativeFilePvPath = path.join(client.clientNumber, DECLARATION.PERTE, pvNewfilename)
      addFileToFolder(relativeFilePvPath, pv)

      const doc = await Perte.create({
        type: docType,
        reason: reason,
        number: idNumber,
        idPath: relativeFileIdPath,
        pvPath: relativeFilePvPath,
        ownerId: client.id,
        owner: req.user
      }, { transaction })
      
      if(!doc){
        throw new Error("Anomalie lors de la sauvegarde de la daclaration de perte")
      }

      await transaction.commit()
      res.json({ success: true })
    }
    catch (e) {
      await transaction.rollback()
      const messageTechnique = "Anomalie techniqe survenue lors de la déclaration de perte"
      logger.error(`${messageTechnique} : ${e.message}.`)
      res.status(500).json({ error: messageTechnique })
    }
  }
)

export default document