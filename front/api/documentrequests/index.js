import { userTypeChoice } from './../utils'

export function sendDocumentRequest (userType, documentId) {
  const urlText = 'documentrequests/'
  const url = userTypeChoice(userType, urlText)
  const body = new FormData()
  body.append('type', userType)
  body.append('documentId', documentId)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}

/**
 *
 * @param userType {string}
 * @param requestId {number}
 * @param status {"CONFIRMED" | "REJECTED"}
 * @returns {Promise<Response>}
 */
export function confirmRequest (userType, requestId, status) {
  const urlText = `documentrequests/confirm?requestId=${requestId}&status=${status}`
  const url = userTypeChoice(userType, urlText)
  const body = new FormData()
  body.append('type', userType)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}

/**
 *
 * @param userType {string}
 * @param requestId {number}
 * @returns {Promise<Request>}
 */
export function getDocument (userType, requestId) {
  const urlText = `documentrequests/document?requestId=${requestId}`
  const url = userTypeChoice(userType, urlText)
  const body = new FormData()
  body.append('type', userType)
  body.append('requestId', requestId)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function handshake (userType, idDocument) {
  const urlText = 'documentrequests/handshake'
  const url = userTypeChoice(userType, urlText)
  const body = new FormData()
  body.append('type', userType)
  body.append('id', idDocument)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function getDocumentRequestList (userType) {
  const urlText = 'documentrequests/list'
  const url = userTypeChoice(userType, urlText)
  const body = new FormData()
  body.append('type', userType)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}
