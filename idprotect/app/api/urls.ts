function mergeUrls (baseUrl: string, additionalUrl: string): string {
  if (baseUrl[baseUrl.length - 1] !== '/') {
    baseUrl += '/'
  }

  if (additionalUrl[0] === '/') {
    additionalUrl = additionalUrl.substring(1)
  }

  return baseUrl + additionalUrl
}

const apiUrl = process.env.apiURL!
const apiAdmintUrl = mergeUrls(apiUrl, 'admin')
const apiClientUrl = mergeUrls(apiUrl, 'client')

export function apiIndex (url: string): string {
  return mergeUrls(apiUrl, url)
}

export function apiClient (url: string): string {
  return mergeUrls(apiClientUrl, url)
}

export function apiAdmin (url: string): string {
  return mergeUrls(apiAdmintUrl, url)
}