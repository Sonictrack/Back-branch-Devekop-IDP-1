import { userTypeChoice } from "./utils";
import { UserType } from "../components/enums/userType";

export function getFolders (type: UserType): Promise<Response> {
    const url = userTypeChoice(type, 'folders')
    const body = new FormData()  
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function getSystemFolder(type: UserType, folderName: string, ownerId: string): Promise<Response> {
    const url = userTypeChoice(type, 'systemFolder')
    const body = new FormData()  
    body.append('folderName', folderName)
    body.append('ownerId', ownerId)
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function getClientsFolders (type: UserType): Promise<Response> {
    const url = userTypeChoice(type, 'clients_folders')
    const body = new FormData()  
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function getFolder (type: UserType, id: Number): Promise<Response> {
    const urlText = `folder/${id}`
    const url = userTypeChoice(type, urlText)
    const body = new FormData()  
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function updateFolder (type: UserType, folder: any, filesToUpload: [], filesToDelete: []): Promise<Response> {
    const urlText = `folder/${folder.id}`
    const url = userTypeChoice(type, urlText)
    const body = new FormData()  
    body.append('folder', JSON.stringify(folder))
    for (const file of filesToUpload) {
      // @ts-ignore
      body.append('filesToUpload',file, file.name)
    }
    body.append('filesToDelete',JSON.stringify(filesToDelete))
    body.append('type', type)
    return fetch(url, { method: 'PUT', body, credentials: 'include' })
}

export function deleteFolder (type: UserType, id: Number): Promise<Response> {
    const urlText = `folder/${id}`
    const url = userTypeChoice(type, urlText)
    const body = new FormData()  
    body.append('type', type)
    return fetch(url, { method: 'DELETE', body, credentials: 'include' })
}

export function createFolder (type: UserType, name: string, visibility: string, filesToUpload: []): Promise<Response> {
    const url = userTypeChoice(type, "folder")
    const body = new FormData()
    body.append('name', name)
    body.append('visibility', visibility)
    for (const file of filesToUpload) {
      // @ts-ignore
      body.append('filesToUpload',file, file.name)
    }
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
 }
  

 export function deleteAuthorization (type: UserType, id: Number): Promise<Response> {
    const urlText = `client_folder/${id}`
    const url = userTypeChoice(type, urlText)
    const body = new FormData()  
    body.append('type', type)
    return fetch(url, { method: 'DELETE', body, credentials: 'include' })
}

export function askFoldersAuthorization (type: UserType, demandesAuthorizations: any): Promise<Response> {
    const url = userTypeChoice(type, 'ask_folders_authorization')
    const body = new FormData()
    body.append('idFolders', demandesAuthorizations)
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function searchFoldersByIdClient (type: UserType, id: String): Promise<Response> {
    const urlText = `search_folders_id_client/${id}`
    const url = userTypeChoice(type, urlText)
    const body = new FormData()  
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}