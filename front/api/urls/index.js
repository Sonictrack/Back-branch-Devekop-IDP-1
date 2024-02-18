/**
 *
 * @param {string} baseUrl
 * @param {string} additionalUrl
 * @returns
 */
function mergeUrls (baseUrl, additionalUrl) {
  if (baseUrl[baseUrl.length - 1] !== '/') {
    baseUrl += '/'
  }

  if (additionalUrl[0] === '/') {
    additionalUrl = additionalUrl.substring(1)
  }

  return baseUrl + additionalUrl
}


// ***************************************************************
// URL A POINTER EN PROD 
// var apiUrl = 'https://app.idprotect.fr/api';
// var hostname = window.location.hostname; 
// if (hostname === 'localhost' || hostname === '127.0.0.1') { 
//   apiUrl = 'http://localhost:3000/api'
// } else { 
//   apiUrl = 'https://app.idprotect.fr/api'
// } 

// URL A POINTER EN STAGGING 
// var apiUrl = 'https://idprotect-staging.herokuapp.com/api';
// var hostname = window.location.hostname; 
// if (hostname === 'localhost' || hostname === '127.0.0.1') { 
//   apiUrl = 'http://localhost:3000/api'
// } else { 
//   apiUrl = 'https://idprotect-staging.herokuapp.com/api'
// }  
// ****************************************************************


// const apiUrl = process.env.baseUrl || 'http://localhost:3000/api'; 
var apiUrl = 'https://app.idprotect.fr/api';
var hostname = window.location.hostname; 
if (hostname === 'localhost' || hostname === '127.0.0.1') { 
  apiUrl = 'http://localhost:3000/api'
} else { 
  apiUrl = 'https://app.idprotect.fr/api'
} 
const apiAdmintUrl = mergeUrls(apiUrl, 'admin')
const apiClientUrl = mergeUrls(apiUrl, 'client')

/**
 *
 * @param {string} url
 * @returns {string}
 */
export function apiIndex (url) {
  return mergeUrls(apiUrl, url)
}

/**
 *
 * @param {string} url
 * @returns {string}
 */
export function apiClient (url) {
  return mergeUrls(apiClientUrl, url)
}

/**
 *
 * @param {string} url
 * @returns {string}
 */
export function apiAdmin (url) {
  return mergeUrls(apiAdmintUrl, url)
}
