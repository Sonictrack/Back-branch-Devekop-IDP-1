import { userTypeChoice } from "./utils";
import { UserType } from "../components/enums/userType";

export function getDocument (userType: UserType, folderId: Number, documentId: Number): Promise<Response> {
    const urlText = `document/${folderId}/${documentId}`
    const url = userTypeChoice(userType, urlText)
    const body = new FormData()
    body.append('type', userType)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function downloadFile(type: UserType, filepath: string): Promise<Response> {
    const url = userTypeChoice(type, 'download_file')
    const body = new FormData()
    body.append('filepath', filepath)
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function getLostDocuments (userType: UserType): Promise<Response> {
    const url = userTypeChoice(userType, 'get_lost_documents')
    const body = new FormData()
    body.append('type', userType)  
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function saveLostDocuments (userType: UserType, reason: string, idNumber: string, image: File, pv: File, type: string): Promise<Response> {
    const url = userTypeChoice(userType, 'save_lost_documents')
    let body = new FormData()
    body.append('idNumber', idNumber)
    body.append('reason', reason)
    body.append('id', image)
    body.append('pv', pv)
    body.append('docType', type)
    body.append('type', userType)
    return fetch(url, { method: 'POST', body, credentials: 'include'})
}

export function getDocUrl (user: UserType, pvRelativeUrl: string): string {
    return userTypeChoice(user, pvRelativeUrl)
}

export function getPvUrl (user: UserType, pvRelativeUrl: string): string {
    return userTypeChoice(user, pvRelativeUrl)
}

export function searchLostDocument (userType: UserType, idNumber: string, type: string): Promise<Response> { 
    const url = userTypeChoice(userType, 'search_lost_document')
    const body = new FormData()
    body.append('number', idNumber)  
    body.append('docType', type)  
    body.append('type', userType)  
    return fetch( url, { method: 'POST', credentials: 'include', body })
}