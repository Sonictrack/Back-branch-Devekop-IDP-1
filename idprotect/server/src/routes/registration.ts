import logger from '../config/logger'
import express from 'express'
import sequelize from '../init/database'
import Cryptr from 'cryptr'
import path from 'path'
import { QueryTypes, Sequelize, Transaction, UUIDV4  } from "sequelize";

import Client from '../models/Client'
import TokenVerification from '../models/TokenVerification'
import Folder from "../models/Folder"

import { SIZE_PASSWORD, START_NUMERO_CLIENT, DEFAULT_INDIVIDUAL_FOLDERS } from '../utils/constants'
import { USER_TYPE, EMAIL_ACTION, DECLARATION, USER_SIZESPACE } from '../utils/enums'
import { sendEmail } from '../utils/ovh-email'
import { createClientSubFolder, createClientRootFolder, deleteFolder } from '../utils/filesystem'

const cryptr = new Cryptr(process.env.CRYPTO_SECRET_KEY as string) 

async function registration (req: express.Request, res: express.Response) {
  try{

    const userRegistration = req.body

    checkPassword(res, userRegistration)
    
    generateClientNumber(res, userRegistration).then( value => {return userRegistration.clientNumber = value})

    findOrCreateClient(req, res, userRegistration)    

  } catch(e) {
    logger.error(`Anomalie lors de la création du compte client : ${e.message}.`)
    res.status(500).json({ error: "Anomalie lors de la création du compte client." })
  }

}

function checkPassword(res: express.Response, userRegistration: any) {
  let errors: string[] = []
  logger.debug(`Vérification validité email client ${userRegistration.type}.`)
  if (userRegistration.password.length < SIZE_PASSWORD) {
    errors.push(`Le mot de passe est trop court - il faut moins de ${SIZE_PASSWORD} caractères.`)
  }
 
  if (userRegistration.password.search(/[0-9]/) < 0) {
    errors.push('Le mot de passe ne contient aucun chiffre.')
  }

  if (userRegistration.password.search(/[a-zA-Z]/) < 0) {
    errors.push('Le mot de passe ne contient aucune lettre.')
  }

  if (errors.length > 0) {
    logger.error(`Vérification validité email client ${userRegistration.type} - Errors: ${errors}.`)
    return res.status(400).json({ error: errors })
  }

}

// async function generateClientNumberOld(res: express.Response, userRegistration: any){
//   logger.debug(`Génerération du numéro client ${userRegistration.type}.`)
//   let finalNumeroClient = START_NUMERO_CLIENT
//   try{

//     const queryString = `SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = "${process.env.DATABASE_NAME}" AND TABLE_NAME = "Clients"`
//     const [{AUTO_INCREMENT}]  = await sequelize.query(queryString, {plain: false, raw: false, type: QueryTypes.SELECT})
//     if(!AUTO_INCREMENT){
//       throw new Error("Récupération du prochain ID autoincrement Client impossible")
//     }
    
//     const letter = userRegistration.type.toLowerCase() === USER_TYPE.PARTNER ? USER_TYPE.PARTNER.toUpperCase().charAt(0): USER_TYPE.INDIVIDUAL.toUpperCase().charAt(0)
//     finalNumeroClient += AUTO_INCREMENT
  
//     return letter+finalNumeroClient.toString()
//   } catch(e) {
//     finalNumeroClient = START_NUMERO_CLIENT
//     logger.error(`Anomalie technique lors de la génération du numéro client : ${e.message}.`)
//     res.status(500).json({ error: "Anomalie lors de la génération du numéro client." })
//   }
// }

async function generateClientNumber(res: express.Response, userRegistration: any){
  logger.debug(`Génerération du numéro client ${userRegistration.type}.`)
  try{
    const letter = userRegistration.type.toLowerCase() === USER_TYPE.PARTNER ? USER_TYPE.PARTNER.toUpperCase().charAt(0): USER_TYPE.INDIVIDUAL.toUpperCase().charAt(0)
    let clientNumber = null
    let end = false
    do {
      
      clientNumber = letter+Math.floor(10000000 + Math.random() * 90000000).toString()    
      const client = await Client.findOne({ where: { clientNumber } })
      
      if(!client)
        end = true

      } while (!end);  

    if(!clientNumber)
      throw new Error("clientNumber est null")

    return clientNumber
  } catch(e) {
    logger.error(`Anomalie technique lors de la génération du numéro client : ${e.message}.`)
    res.status(500).json({ error: "Anomalie lors de la génération du numéro client." })
  }
}

async function findOrCreateClient(req: express.Request, res: express.Response, userRegistration: any){
  logger.debug(`Recherche ou création du compte client ${JSON.stringify(userRegistration)}.`)
  try{
    const client = await Client.findOne({ where: { email: userRegistration.email } })
    if(client){
      logger.error(`Email déjà utilisé pour le compte client ${userRegistration.clientNumber}.`)
      return res.status(400).json({ error: "Cet email est déjà utilisé." })
    }

    createClient(req, res, userRegistration)

  } catch(e) {
    logger.error(`Recherche ou création du compte client : ${e.message}.`)
    res.status(500).json({ error: "Anomalie lors de la création du compte client." })
  }
}

async function createClient(req: express.Request, res: express.Response, userRegistration: any){
  const transaction = await sequelize.transaction()
  userRegistration.suspended = false
  userRegistration.lastConnected = new Date()
  if(userRegistration.type === USER_TYPE.PARTNER){ 
    userRegistration.sizeSpace = USER_SIZESPACE.PARTNER
  }
  logger.debug(`Création de compte client ${userRegistration.clientNumber}.`)
  try{
    const user = await Client.create(userRegistration, { transaction })
    if(!user)
      throw new Error()

      if(user.type !== USER_TYPE.ADMIN){
        logger.debug(`Création du dossier racine pour ${user.clientNumber}.`)
        createClientRootFolder(user.clientNumber)
        if(user.type === USER_TYPE.INDIVIDUAL){        
          logger.debug(`Création des dossiers par défaut du client particulier ${user.clientNumber}.`)
          for(let i=0; i<DEFAULT_INDIVIDUAL_FOLDERS.length; i++){
            createDefaultFolders(user, DEFAULT_INDIVIDUAL_FOLDERS[i])
            if(DECLARATION.PERTE !== DEFAULT_INDIVIDUAL_FOLDERS[i]){
              const folder = await Folder.create({ name: DEFAULT_INDIVIDUAL_FOLDERS[i], visibility: false, system: true, adminAccess: true, ownerId: user.id }, { transaction })
              if (!folder) {
                throw new Error(`Anomalie lors de la création du dossier ${DEFAULT_INDIVIDUAL_FOLDERS[i]}.`)
              }
            }
          }
        }
      }

    logger.debug(`Création du token de vérification de création de compte du client ${user.clientNumber}.`)
    const token = await TokenVerification.create( { userId: user.clientNumber, token: cryptr.encrypt(user.email) }, {transaction})

    logger.info(`Préparation de l'envoi de confirmation email à ${user.email} pour le client ${user.clientNumber}.`)

    await sendEmail(user.email, token.token, EMAIL_ACTION.VERIFY as string).then((err: any) => {if(err){
      throw new Error(err)
    }})

    await transaction.commit()
    res.status(201).json({ success: `Un email de confirmation a été envoyé à ${user.email}. Ce lien est valable 15 minutes.` })

  } catch(e) {
    await transaction.rollback()
    const absDirectory = path.join(userRegistration.clientNumber, '')
    deleteFolder(absDirectory)
    logger.error(`Anomalie lors de la création du compte ${userRegistration.clientNumber} : ${e.message}.`)
    res.status(500).json({ error:"Anomalie lors de la création du compte." })
  }
}

async function createDefaultFolders(individual: any, folderName: string){
  try{
    const absDirectory = path.join(individual.clientNumber, folderName)
    createClientSubFolder(absDirectory)
  }catch(e){
    throw new Error(e)
  }
}

async function createClientFolder(user: Client, transaction: any){
  if(user.type !== USER_TYPE.ADMIN){
    logger.debug(`Création du dossier racine pour ${user.clientNumber}.`)
    createClientRootFolder(user.clientNumber)
    if(user.type === USER_TYPE.INDIVIDUAL){        
      logger.debug(`Création des dossiers par défaut du client particulier ${user.clientNumber}.`)
      for(let i=0; i<DEFAULT_INDIVIDUAL_FOLDERS.length; i++){
        createDefaultFolders(user, DEFAULT_INDIVIDUAL_FOLDERS[i])
        if(DECLARATION.PERTE !== DEFAULT_INDIVIDUAL_FOLDERS[i]){
          const folder = await Folder.create({ name: DEFAULT_INDIVIDUAL_FOLDERS[i], visibility: false, system: true, adminAccess: true, ownerId: user.id }, { transaction })
          if (!folder) {
            throw new Error(`Anomalie lors de la création du dossier ${DEFAULT_INDIVIDUAL_FOLDERS[i]}.`)
          }
        }
      }
    }
  }
}

export { registration, createDefaultFolders }