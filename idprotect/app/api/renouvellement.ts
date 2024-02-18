import { userTypeChoice, JsonHeaders } from "./utils";
import { UserType } from "../components/enums/userType";

export function renewAnonymous(data: any) {
    const url = userTypeChoice(UserType.client, "renew_anonymous")
    return fetch(url, { method: "POST", body: JSON.stringify(data), headers: JsonHeaders() })
  }
  
  export function renew(type: UserType, data: any) {
    const url = userTypeChoice(type, "renew")
    const body = new FormData()
    body.append('data', JSON.stringify(data))
    body.append('type', type)
    return fetch(url, { method: "POST", body,  credentials: 'include' })
  }
  
  export function allRenewRequest(type: UserType) {
    const url = userTypeChoice(type, "all_renew_request")
    const body = new FormData()
    body.append('type', type)
    return fetch(url, { method: "POST", body, credentials: 'include' })
  }
  
  export function changeStatusRenew(type: UserType, demand: any) {
    const url = userTypeChoice(type, "change_status_renew")
    const body = new FormData()
    body.append('demand', JSON.stringify(demand))
    body.append('type', type)
    return fetch(url, { method: "PUT", body, credentials: 'include' })
  }