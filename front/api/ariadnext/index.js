import { userTypeChoice } from './../utils'

export function startAnalysis (userType, document1, document2) {
  const url = userTypeChoice(userType, '/ariadnext/analysis')
  const body = new FormData()
  body.append('type', userType)
  body.append('domain', 'PRODUCTION')
  body.append('recto', document1)
  body.append('verso', document2)
  return fetch(url, { method: 'POST', credentials: 'include', body })
}

export function getUserCurrentVerifications (userType) {
  const url = userTypeChoice(userType, '/ariadnext/get_analysis_history')
  const body = new FormData()
  body.append('type', userType)
  return fetch(url, { method: 'POST', credentials: 'include', body })
}

export function getDocumentAnalysis (userType, uid) {
  const url = userTypeChoice(userType, '/ariadnext/get_analysis')
  const body = new FormData()
  body.append('type', userType)
  body.append('uid', uid)
  return fetch(url, { method: 'POST', credentials: 'include', body })
}
