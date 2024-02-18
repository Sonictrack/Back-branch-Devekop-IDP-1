import { userTypeChoice } from './../utils'

export function addCreditsToUser (userType, credits, amount) {
  const url = userTypeChoice(userType, 'add_credits')
  const body = new FormData()
  body.append('type', userType)
  body.append('amount', amount)
  body.append('credits', credits)
  return fetch(url, { method: 'POST', credentials: 'include', body })
}

export function getUserCurrentCredits (userType, userId) {
  const url = userTypeChoice(userType, 'credits')
  const body = new FormData()
  body.append('type', userType)
  body.append('userId', userId)
  return fetch(url, { method: 'POST', credentials: 'include', body })
}

export function getUserCurrentPayments (userType) {
  const url = userTypeChoice(userType, 'payment_logs')
  const body = new FormData()
  body.append('type', userType)
  return fetch(url, { method: 'POST', credentials: 'include', body })
}
