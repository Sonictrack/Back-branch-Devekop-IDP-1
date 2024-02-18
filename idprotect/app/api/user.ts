import { userTypeChoice, JsonHeaders } from "./utils";
import { UserType } from "../components/enums/userType"


export function userLogin(data: any) {
    const url = userTypeChoice(data.type, "login")
    return fetch(url, { method: "POST", body: JSON.stringify(data), headers: JsonHeaders(), credentials: "include"})
}

export function userRegister(data: any) {
    const url = userTypeChoice(data.type, "register")
    return fetch(url, { method: "POST", body: JSON.stringify(data), headers: JsonHeaders(), credentials: "include"})
}

export function refreshUserDetail (type: UserType): Promise<Response> {
  const url = userTypeChoice(type, "account")
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}

export function logout (): Promise<Response> {
  const url = userTypeChoice(UserType.all, "logout")
  return fetch(url, { method: 'GET', credentials: 'include' })
}

export function userConfirmation(token: string) {
  const url = userTypeChoice(UserType.client, "confirmation")
  const body = new FormData()
  body.append('token', token)
  return fetch(url, { method: 'POST', body })
}

// actionType : verification de compte ou reinitialisation password
export function resend(email: string, actionType: string) {
  const url = userTypeChoice(UserType.client, "resend")
  const body = new FormData()
  body.append('email', email)
  body.append('action', actionType)
  return fetch(url, { method: 'POST', body })
} 

export function resetPassword(token: string, password: string) {
  const url = userTypeChoice(UserType.client, "password")
  const body = new FormData()
  body.append('token', token)
  body.append('password', password)
  return fetch(url, { method: 'POST', body })
}

export function allUsers(type: UserType, userTypeToCheck: string) {
  const url = userTypeChoice(type, "users")
  const body = new FormData()  
  body.append('userTypeToCheck', userTypeToCheck)
  body.append('type', type)
  return fetch(url, { method: "POST", body, credentials: 'include' })
}

export function updateUser(type: UserType, client: any, userTypeToCheck: string) {
  const url = userTypeChoice(type, "user")
  const body = new FormData()  
  body.append('userTypeToCheck', userTypeToCheck)
  body.append('client', JSON.stringify(client)) 
  body.append('type', type)
  return fetch(url, { method: "PUT", body, credentials: 'include'})
}

export function checkEmailUsed(email: string) {
  const url = userTypeChoice(UserType.client, "check_email")
  const body = new FormData()  
  body.append('email', email)
  return fetch(url, { method: "POST", body})
}

export function checkUserAllowed(type: UserType) {
  const url = userTypeChoice(type, "check_user_allowed")
  const body = new FormData()  
  body.append('type', type)
  return fetch(url, { method: "POST", body, credentials: 'include'})
}