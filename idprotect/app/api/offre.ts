import { userTypeChoice } from './utils';
import { UserType } from '../components/enums/userType';

export function getOffres (type: UserType): Promise<Response> {
    const url = userTypeChoice(type, 'offre/all')
    const body = new FormData()
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function del (type: UserType, id: string) {
    const urlText = `offre/delete/${id}`
    const url = userTypeChoice(type, urlText)
    const body = new FormData()
    body.append('type', type)
    return fetch(url, { method: 'DELETE', body, credentials: 'include' })
}

export function save (type: UserType, offre: any) {
    const url = userTypeChoice(type, 'offre/save')
    const body = new FormData()
    body.append('offre', JSON.stringify(offre))
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include'})
}

export function update (type: UserType, offre: any) {
    const url = userTypeChoice(type, 'offre/update')
    const body = new FormData()
    body.append('offre', JSON.stringify(offre))
    body.append('type', type)
    return fetch(url, { method: 'PUT', body, credentials: 'include'})
}