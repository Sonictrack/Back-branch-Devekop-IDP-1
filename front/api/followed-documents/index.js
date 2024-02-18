import { userTypeChoice } from './../utils'

/**
 *
 * @param userType {string}
 * @param documentId {number}
 * @returns {Promise<Response>}
 */
export function addFollowingDocument (userType, documentId, documentType) {
  const urlText = 'followeddocuments/'
  const url = userTypeChoice(userType, urlText)
  const body = new FormData()
  body.append('type', userType)
  body.append('documentId', documentId)
  body.append('documentType', documentType)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function getFollowedDocuments (userType) {
  const urlText = 'followeddocuments/get-documents'
  const url = userTypeChoice(userType, urlText)
  const body = new FormData()
  body.append('type', userType)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function deleteDocument (userType, documentId) {
  const urlText = 'followeddocuments/delete'
  const url = userTypeChoice(userType, urlText)
  const body = new FormData()
  body.append('type', userType)
  body.append('documentId', documentId)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}


  /**
   * Update State Document 
   * @param {*} { documentNumber , state document(locked or not locked)}
   */
  export function updateStateDocument (data) {
    const url = '/api/client/followeddocuments/state' 
    const body = new FormData()
    body.append('locked', data.locked)
    body.append('number', data.number)
    body.append('type', data.userType)
    return fetch(url, { method: 'PUT', body, credentials: 'include' }) 
  }