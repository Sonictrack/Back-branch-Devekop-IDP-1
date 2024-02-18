import { userTypeChoice } from "./utils";
import { UserType } from "../components/enums/userType";

export function deleteAccount(userType: UserType): Promise<Response> {
  const url = userTypeChoice(userType, "account");
  const body = new FormData()
  body.append('type', userType)
  return fetch(url, { method: "DELETE", body, credentials: "include" });
}

export function updateAccount (userType: UserType, account: Object): Promise<Response> {
  const urlText = "account"
  const url = userTypeChoice(userType, urlText)
  const body = new FormData()
  body.append('type', userType)
  body.append('account', JSON.stringify(account))
  return fetch(url, { method: 'PUT', body, credentials: 'include' })
}

export function getAccount (userType: UserType): Promise<Response> {
  const url = userTypeChoice(userType, "account")  
  const body = new FormData()
  body.append('type', userType)
  return fetch(url, { method: 'POST', body, credentials: 'include' })
}