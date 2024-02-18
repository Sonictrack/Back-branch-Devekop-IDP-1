import logger from '../config/logger'
import { Router } from 'express'
import sequelize from '../init/database'
import { Op } from 'sequelize'
import path from 'path'
import { UploadedFile } from "~/node_modules/@types/express-fileupload"

import { userLoggedIn } from "../middlewares/isLoggedIn"
import { generateUuidFilename, createClientSubFolder, addFileToFolder, removeFileFromFolder, deleteFolder, checkOverQuota } from '../utils/filesystem'

import Client from "../models/Client"
import Admin from "../models/Admin"
import Folder from "../models/Folder"
import Document from "../models/Document"
import FolderAuthorization from "../models/FolderAuthorization"

const folder = Router()

folder.post("/folder/:id", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /folder/:id")
  try {
    const client = req.user as Client 

    const folderId = req.params.id;
    logger.debug(`Récupération du dossier n° ${folderId} du client ${client.clientNumber}.`)
    const folder = await Folder.findOne({ where: { ownerId: client.id, id: folderId }, 
      include: [ 
        { model: Document, attributes: ["id", "name", "path"] }, 
        { model: FolderAuthorization, attributes: ["isAuthorized", "clientId"] } 
      ] })

    if (!folder) {
      logger.error(`Impossible de récupérer le dossier n° ${folderId} du client ${client.clientNumber}.`)
      return res.status(404).send({ error: "Ce dossier n'existe pas." })
    }

    const idPartners: any = [ ...new Set(folder.authorizations.map((f) => f.clientId)) ]

    let partners
    if (idPartners) {
      partners = await Client.findAll({ where: { id: { [Op.in]: idPartners } }, 
        attributes: [ "id", "clientNumber", "firstname", "lastname", "companyName", "phoneNumber" ] })
    }

    res.send({ folder, partners })
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors de la récupération du dossier"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

folder.post("/folders", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /folders")
  try {
    const client = req.user as Client

    logger.debug(`Récupération des dossiers du client ${client.clientNumber}.`)
    const folders = await Folder.findAll({
        where: { ownerId: client.id },
        include: [ 
          { model: Document, attributes: ["id", "name", "path"] },
          { model: FolderAuthorization, attributes: ["id", "isAuthorized", "clientId"],
            include: [ { model: Client, attributes: [ "id", "type", "clientNumber", "firstname", "lastname", "companyName" ] } ] } 
          ]
      })

      res.send(folders)
    } catch (e) {
      const messageTechnique = "Anomalie technique survenue lors de la récupération des dossiers"
      logger.error(`${messageTechnique} : ${e.message}.`)
      res.status(500).json({ error: messageTechnique })
    }
})

folder.post("/clients_folders", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /clients_folders")
  try {
    const client = req.user as Client

    logger.debug(`Récupération des dossiers des clients par le client ${client.clientNumber}.`)
      const individuals = await Client.findAll({attributes: { exclude: ['password'] },
      include: [ { model: Folder, attributes: ["id", "name"], where: { visibility: 1 }, 
      include: [ { model: Document, attributes: ["id", "name", "path"] }, { model: FolderAuthorization, attributes: ["isAuthorized"], where: { clientId: client.id }}]}
      ]})

      res.send({result: individuals})
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors de la récupération des dossiers des particuliers"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

folder.post("/ask_folders_authorization", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /ask_folders_authorization")
  const transaction = await sequelize.transaction()
  try {
    const client = req.user as Client
    
    const idFoldersString: string = req.body.idFolders
    logger.debug(`Demande des autorisations par le client ${client.clientNumber} sur les n° de dossiers ${idFoldersString}.`)
    if (idFoldersString === null || idFoldersString.length == 0) {
      logger.error(`La liste des dossiers à autoriser pour le client ${client.clientNumber} sur les n° de dossiers est manquante.`)
      return res.status(400).json({ error: "Merci de selectionner les dossiers sur lesquels vous autoriser."})
    }

    const idFolders: string[] = idFoldersString.split(",")

    for (let i = 0; i < idFolders.length; i++) {
      const folderId = idFolders[i]
      const authorization = await FolderAuthorization.create({ clientId: client.id, isAuthorized: 0, folderId: folderId})

      if (!authorization) {
        throw new Error("Création de l'autorisation impossible.")
      }
    }
    await transaction.commit()
    res.status(201).send({ success: "Demande d'authorisation envoyé." })
  } catch (e) {
    await transaction.rollback()
    const messageTechnique = "Anomalie technique survenue lors de la demande d'autorisation"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

folder.post("/search_folders_id_client/:id", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /search_folders_id_client/:id")
  try {
    const client = req.user as Client

    const clientNumber = client.clientNumber
    const individualClientNumber = req.params.id
    if(!individualClientNumber){
      logger.error(`Le numéro client recherché est manquant.`)
      return res.status(400).send({ error: "Le numéro client recherché est manquant." })
    }
    logger.debug(`Recherche des dossiers du client ${individualClientNumber} par le client ${clientNumber}.`)

    if (clientNumber && individualClientNumber && clientNumber === individualClientNumber) {
      logger.error(`Le client ${individualClientNumber} recherche son propre numéro.`)
      return res.status(400).json({ error: "Veuillez choisir un autre numéro client que le votre." })
    }
  
    const result = await Client.findOne({ where: { clientNumber: individualClientNumber }, attributes: ["id", "clientNumber", "firstname", "lastname"],
      include: [ 
        { model: Folder, where: {visibility: 1}, include: [
          { model: FolderAuthorization, attributes: ["isAuthorized", "clientId", "folderId"] } 
        ] } 
      ] 
    })

    if (!result) {
      logger.error(`Le client ${individualClientNumber} recherché par le client ${clientNumber} est inconnu du système ou n'a pas de dossiers visibles.`)
      return res.status(404).json({ error: "Aucuns dossiers visibles pour ce numéro client." })
    }

    const user = await Client.findOne({ where: { clientNumber: client.clientNumber }, attributes: { exclude: ['password'] }})
    if (!user) {
      logger.error(`Le client ${clientNumber} est inconnu du système.`)
      return res.status(404).json({ error: "Utilsateur inconnu." })
    }

    res.send({ result, user })
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors de la recherche des dossiers du client"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

folder.delete("/client_folder/:id", userLoggedIn, async (req, res) => {
  logger.info("Appel DELETE /client_folder/:id")
  const transaction = await sequelize.transaction()
  try {
    const client = req.user as Client

    const folderId = req.params.id
    if(!folderId){
      logger.error("Numéro du dossier manquant dans la requête")
      return res.status(400).send({ error: "Numéro du dossier manquant dans la requête." })
    }

    logger.debug(`Suppression de l' autorisation par le client ${client.clientNumber} sur le dossier n° ${folderId}.`)
    const authorization = await FolderAuthorization.destroy({ where: { folderId: folderId, clientId: client.id }})

    if (authorization === 0) {
      throw new Error("N° de dossier ou n° client inconnu.")
    }

    await transaction.commit()
    res.send({ success: "Autorisation supprimée avec succès" })
  } catch (e) {
    await transaction.rollback()
    const messageTechnique = "Anomalie technique survenue lors de la suppression de l'autorisation"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

folder.post("/systemFolder", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /systemFolder")
  const transaction = await sequelize.transaction()
  try {
    const admin = req.user as Admin

      const ownerId = req.body.ownerId
      const folderName = req.body.folderName
      if(!ownerId || !folderName){
        logger.error("Nom du dossier ou numéro du propriétaire manquant dans la requête")
        return res.status(400).send({ error: "Donnéées manquantes dans la requête." })
      }

      const folder = await Folder.findOne({ where: { ownerId, name: folderName }, 
        include: [ 
          { model: Document, attributes: ["id", "name", "path"] }, 
          { model: FolderAuthorization, attributes: ["isAuthorized", "clientId"] } 
        ] })

      if (!folder) {
        logger.error(`Impossible de récupérer le dossier n° ${folderName} pour l'utilisateur n° ${ownerId}.`)
        return res.status(404).send({ error: "Impossible de récupérer le dossier" })
      }
  
      res.send({ folder })
  } catch (e) {
    const messageTechnique = "Anomalie technique survenue lors de la récupération du dossier"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

folder.post("/folder", userLoggedIn, async (req, res) => {
  logger.info("Appel POST /folder")
  const transaction = await sequelize.transaction()
  try {
    const client = req.user as Client

    logger.debug(`Création du dossier ${req.body.name} pour le client ${client.clientNumber}.`)

    const folder = await Folder.create({ name: req.body.name, visibility: Number(req.body.visibility), ownerId: client.id }, { transaction })

    if (!folder) {
      throw new Error("Création impossible")
    }

    const absDirectory = path.join(client.clientNumber, folder.id.toString())
    createClientSubFolder(absDirectory)

    const documents = !req.files ? null : (req.files.filesToUpload as UploadedFile | UploadedFile[])
    if (documents) {
      let documentsArray: UploadedFile[] = []
      documentsArray = documentsArray.concat(documents)
      if(!checkOverQuota(client, documentsArray)){
        for (let i = 0; i < documentsArray.length; i++) {
          const newfilename = generateUuidFilename(documentsArray[i].name);
          const relativeFilePath = path.join(client.clientNumber, folder.id.toString(), newfilename)
          const document = await Document.create({ name: newfilename, path: relativeFilePath, folderId: folder.id }, { transaction })
          if (!document) {
            throw new Error(`Impossible de créer le document ${documentsArray[i].name} dans le dossier ${folder.name}.`)
          }
  
          addFileToFolder(document.path, documentsArray[i])
        }
      } else {
        logger.error("Dépassement de quota.")
        return res.status(400).json({ error: `Vous avez dépasser votre quota d'espace fixé à ${client.sizeSpace} MB.` })
      }
    }

    await transaction.commit()
    res.status(201).send({ success: "success" })
  } catch (e) {
    await transaction.rollback()
    const messageTechnique = "Anomalie technique survenue lors de la création du dossier"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

folder.put("/folder/:id", userLoggedIn, async (req, res) => {
  logger.info("Appel PUT /folder/:id")
  const transaction = await sequelize.transaction()
  try {
    const client = req.user as Client

    const folderId = req.params.id;
    if(!folderId){
      logger.error("Numéro du dossier manquant dans la requête")
      return res.status(400).send({ error: "Numéro du dossier manquant dans la requête." })
    }

    logger.debug(`Modification du dossier n° ${folderId}  par le client ${client.clientNumber}.`)
    const folder = JSON.parse(req.body.folder)

    const filesToDelete = JSON.parse(req.body.filesToDelete)
    for (let i = 0; i < filesToDelete.length; i++) {
      const found = await Document.findOne({ where: { id: filesToDelete[i].id, folderId: folder.id }})
      if(!found){
        throw new Error(`Le document n° ${filesToDelete[i].id} du dossier n° ${folderId} recherché par le client ${client.clientNumber} est inconnu.`)
      }

      const deleted = await Document.destroy({ where: { id: filesToDelete[i].id, folderId: folder.id }, transaction })
      if (deleted === 0) {
        throw new Error(`Anomalie suppression du document n° ${filesToDelete[i].id} du dossier n° ${folderId} par le client ${client.clientNumber}.`)
      }

      removeFileFromFolder(found.path)
    }

    const authorizations = folder.authorizations;
    for (let i = 0; i < authorizations.length; i++) {
      if (authorizations[i].isAuthorized === true || authorizations[i].isAuthorized === false) {
        const result = await FolderAuthorization.update({ isAuthorized: authorizations[i].isAuthorized }, { where: {clientId: authorizations[i].clientId, folderId: folder.id }, transaction})
        if (result[0] === 0) {
          throw new Error(`Anomalie de mise à jour de l'autorisation ${authorizations[i]} du dossier n° ${folderId} par le client ${client.clientNumber}.`)
        }
      } else if (authorizations[i].isAuthorized === null) {
        const result = await FolderAuthorization.destroy({ where: { clientId: authorizations[i].clientId, folderId: folder.id }, transaction})
        if (result === 0) {
          throw new Error(`Anomalie de suppression de l'autorisation ${authorizations[i]} du dossier n° ${folderId} par le client ${client.clientNumber}.`)
        }
      }
    }

    const uploadedFiles = !req.files ? null : (req.files.filesToUpload as UploadedFile | UploadedFile[])
    if (uploadedFiles) {
      let documentsArray: UploadedFile[] = []
      documentsArray = documentsArray.concat(uploadedFiles)
      if(!checkOverQuota(client, documentsArray)){
        for (let i = 0; i < documentsArray.length; i++) {
          const newfilename = generateUuidFilename(documentsArray[i].name);
          const subDirectory = folder.system ? folder.name : folderId.toString()
          const relativeFilePath = path.join(client.clientNumber, subDirectory, newfilename)
          const document = await Document.create({ name: newfilename, path: relativeFilePath, folderId: folder.id }, { transaction })
          if (!document) {
            throw new Error(`Anomalie création du document ${documentsArray[i].name} du dossier n° ${folderId} par le client ${client.clientNumber}.`)
          }
  
          addFileToFolder(document.path, documentsArray[i])
        }
      } else {
        logger.error("Dépassement de quota.")
        return res.status(400).json({ error: `Vous avez dépasser votre quota d'espace fixé à ${client.sizeSpace} MB.` })
      }
    }

    const result = await Folder.update(folder, { where: { id: folderId, ownerId: client.id }, transaction})

    if (result[0] === 0)
      throw new Error(`Anomalie mise à jour du dossier n° ${folderId}  par le client ${client.clientNumber}.`)
    

    await transaction.commit()
    res.send({ success: "success" })
  } catch (e) {
    await transaction.rollback()
    const messageTechnique = "Anomalie technique survenue lors de la modification du dossier"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

folder.delete("/folder/:id", userLoggedIn, async (req, res) => {
  logger.info("Appel DELETE /folder/:id")
  const transaction = await sequelize.transaction()
  try {
    const client = req.user as Client

    const folderId = req.params.id;
    if(!folderId){
      logger.error("Numéro du dossier manquant dans la requête")
      return res.status(400).send({ error: "Numéro du dossier manquant dans la requête." })
    }

    logger.debug(`Suppression du dossier n° ${folderId} par le client ${client.clientNumber}.`)

    const deleted = await Folder.destroy({ where: { id: req.params.id, ownerId: client.id }, transaction })
    if (deleted === 0) {
      logger.error(`Suppression impossible du dossier n° ${folderId} par le client ${client.clientNumber}.`)
      return res.status(404).send({ error: "N° de sossier ou n° client inconnu." })
    }

    const absDirectory = path.join(client.clientNumber, folderId.toString())
    deleteFolder(absDirectory)

    await transaction.commit()
    res.send({ success: "Dossier supprimé avec succès" })
  } catch (e) {
    await transaction.rollback()
    const messageTechnique = "Anomalie technique survenue lors de la suppression de compte"
    logger.error(`${messageTechnique} : ${e.message}.`)
    res.status(500).json({ error: messageTechnique })
  }
})

export default folder;
