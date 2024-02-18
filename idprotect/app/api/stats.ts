import { userTypeChoice } from "./utils";
import { UserType } from "../components/enums/userType"


export function admins(type: UserType) {
  const url = userTypeChoice(type, "admins")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function alertes(type: UserType) {
  const url = userTypeChoice(type, "alertes")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function clientdocuments(type: UserType) {
  const url = userTypeChoice(type, "clientdocuments")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function clientfolderauthorizations(type: UserType) {
  const url = userTypeChoice(type, "clientfolderauthorizations")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function clientfolders(type: UserType) {
  const url = userTypeChoice(type, "clientfolders")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function clients(type: UserType) {
  const url = userTypeChoice(type, "clients")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function clientsPerMonth(type: UserType) {
  const url = userTypeChoice(type, "clients_per_month")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body, credentials: 'include' })
}

export function coffres(type: UserType) {
  const url = userTypeChoice(type, "coffres")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function pertes(type: UserType) {
  const url = userTypeChoice(type, "pertes")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function positions(type: UserType) {
  const url = userTypeChoice(type, "positions")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body, credentials: 'include' })
}

export function renouvellements(type: UserType) {
  const url = userTypeChoice(type, "renouvellements")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function sessions(type: UserType) {
  const url = userTypeChoice(type, "sessions")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body,credentials: 'include' })
}

export function tokenverifications(type: UserType) {
  const url = userTypeChoice(type, "tokenverifications")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body, credentials: 'include' })
}

export function notifications(type: UserType) {
  const url = userTypeChoice(type, "notifications")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body, credentials: 'include' })
}

export function stats(type: UserType, statname: string) {
  const url = userTypeChoice(type, statname)
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: "POST", body, credentials: 'include' })
}