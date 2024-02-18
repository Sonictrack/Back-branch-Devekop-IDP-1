
import { UserType } from '../../constants'
import { apiIndex, apiAdmin, apiClient } from './../urls'

/**
 *
 * @param {string} user Une des valeurs de l'énumération UserType
 * @param {string} urlText
 * @returns {string}
 */
export function userTypeChoice (user, urlText) {
  let url = apiIndex(urlText)
  if (user === UserType.admin) {
    url = apiAdmin(urlText)
  } else if (user === UserType.individual || user === UserType.partner || user === UserType.client) {
    url = apiClient(urlText)
  }
  return url
}

export function JsonHeaders () {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

export function urlEncodedHeader () {
  return {
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
}
