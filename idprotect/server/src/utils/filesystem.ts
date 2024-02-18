import fs from "fs"
import path from "path"
import logger from '../config/logger'
import { UploadedFile } from 'express-fileupload'
const { v4: uuid_v4 } = require('uuid');
import { encrypt, decrypt } from './cryptfile'

function getAllFiles(dirPath: string, arrayOfFiles: any) {
  const files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + path.sep + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + path.sep + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, file))
    }
  })

  return arrayOfFiles
}

function convertBytes(bytes: number) {
  return Number((bytes / Math.pow(1024, 2)).toFixed(2))
}

function getTotalSize(directoryPath: string) {
  const arrayOfFiles = getAllFiles(directoryPath, [])
  let totalSize = 0
  arrayOfFiles.forEach((filePath: string) => {
    totalSize += fs.statSync(filePath).size
  })

  return convertBytes(totalSize)
}

function checkOverQuota(user: any, files: UploadedFile[]) {
  const totalSize = getUserSpace(user.clientNumber)
  let totalNewFilesSize = 0
  files.forEach((file: UploadedFile) => {
    totalNewFilesSize += file.size/1024/1024
  })
  return ((totalSize + totalNewFilesSize) > user.sizeSpace) ? true : false
}

function getUserDirectory(clientNumber: string){
  const relativePath = path.join(clientNumber)
  return path.resolve(process.env.FILE_SYSTEME_DIR as string, relativePath)
}

function getUserSpace(clientNumber: string){
  const absDirectory = getUserDirectory(clientNumber)
  return getTotalSize(absDirectory)
}

function getExtension(name: string): string {
  const splitName = name.split('.')
  return splitName[splitName.length - 1]
}

function getDecryptedFile(filepath: string){
  const result = builAbsolutePath(filepath)
  const encrypted = fs.readFileSync(result);
  return  decrypt(encrypted)
}

function generateUuidFilename(filename: string){
  return  uuid_v4() +'-uuid-'+ filename.replace(/[^a-zA-Z0-9.-]/gi, "_");
}

function builAbsolutePath(filepath: string){
  return  path.join(process.env.FILE_SYSTEME_DIR as string, filepath)
}

function builRelativeFilePath(clientNumber: string, folderId: string, filename: string){
  const relativeFilePath = path.join(clientNumber, folderId, generateUuidFilename(filename))
  return  path.resolve(process.env.FILE_SYSTEME_DIR as string, relativeFilePath)
}

function createClientRootFolder(folder: string){
  try{
    const absDirectory = path.resolve(process.env.FILE_SYSTEME_DIR as string, folder)
    if (!fs.existsSync(absDirectory)){
      fs.mkdirSync(absDirectory);
      return
    } 
    throw new Error(`Le dossier ${folder} existe déjà.`) 
    
  } catch(e) {
    logger.error(`Anomalie lors de la création du dossier ${folder} : ${e.message}`) 
    throw new Error(e.message)
  }
}

function createClientSubFolder(folder: string){
  const subFolder = builAbsolutePath(folder)
  if (!fs.existsSync(subFolder)){
    fs.mkdir(subFolder, { recursive: true }, (err) => {
      if (err) { logger.warn('Ce dossier existe déjà :', err) }
    })
  }
}

function deleteFolder(folderPath: string){
  const absoluteFolderPath = builAbsolutePath(folderPath)
  if (fs.existsSync(absoluteFolderPath)) {
    fs.rmdirSync(absoluteFolderPath, { recursive: true })
  } else {
    throw new Error("Répertoire inconnu.")
  }
}

function addFileToFolder(fileRelativePath: string, file: UploadedFile){
  const fileEncrypted = encrypt(file.data)
  const filepath = builAbsolutePath(fileRelativePath)
  fs.mkdir(path.dirname(filepath), { recursive: true }, async (err) => {
    if (err) { logger.warn('Ce dossier existe déjà :', err) }
    await fs.writeFileSync(filepath, fileEncrypted);
  })
}

function removeFileFromFolder(filepath: string){
  const asbolutePath = builAbsolutePath(filepath)
  fs.unlink(asbolutePath, async (e) => {
    if (e)
      throw new Error(e.message)
  })
}

export { generateUuidFilename, getDecryptedFile, createClientSubFolder, getUserSpace, getExtension, addFileToFolder, removeFileFromFolder, deleteFolder, createClientRootFolder, checkOverQuota }