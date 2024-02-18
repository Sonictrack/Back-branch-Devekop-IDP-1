import { userTypeChoice } from "./utils";
import { UserType } from "../components/enums/userType"

export function getLockDocumentAnonymous(user: UserType, id: string) {
    const urlText = `lockdocument_anonymous/${id}`
    const url = userTypeChoice(user, urlText)
    return fetch(url, { method: "GET" })
}

export function getLockDocument(type: UserType, id: string) {
    const urlText = `lockdocument/${id}`
    const url = userTypeChoice(type, urlText)
    const body = new FormData()  
    body.append('type', type)
    return fetch(url, { method: "POST", body, credentials: 'include'})
}

export function getAll(type: UserType) {
    const url = userTypeChoice(type, "lockdocuments")
    const body = new FormData()  
    body.append('type', type)
    return fetch(url, { method: "POST", body, credentials: 'include' })
}

export function saveAnonymous(lockdocument: any) {
    const url = userTypeChoice(UserType.admin, "lockdocument")
    const body = new FormData()
    body.append('lockdocument', JSON.stringify(lockdocument))
    return fetch(url, { method: "POST", body})
}

export function save(type: UserType, lockdocument: any) {
    const url = userTypeChoice(type, "lockdocument")
    const body = new FormData()
    body.append('lockdocument', JSON.stringify(lockdocument))
    body.append('type', type)
    return fetch(url, { method: "POST", body, credentials: 'include'})
}

export function update(type: UserType, lockdocument: any) {
    const url = userTypeChoice(type, "lockdocument")
    const body = new FormData()
    body.append('lockdocument', JSON.stringify(lockdocument))
    body.append('type', type)
    return fetch(url, { method: "PUT", body, credentials: 'include'})
}

export function del(type: UserType, id: string) {
    const urlText = `lockdocument/${id}`
    const url = userTypeChoice(type, urlText)
    const body = new FormData()
    body.append('type', type)
    return fetch(url, { method: "DELETE", body, credentials: 'include' })
}