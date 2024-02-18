
import { UserType } from "../components/enums/userType";
import { apiIndex, apiAdmin, apiClient } from './urls'

export function userTypeChoice(user: UserType, urlText: string){
    let url = apiIndex(urlText)
    if(user === UserType.admin){
      url = apiAdmin(urlText)
    }else if(user === UserType.individual || user === UserType.partner || user === UserType.client){
      url = apiClient(urlText)
    }
    return url;
  }

export function JsonHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
}

export function urlEncodedHeader() {
  return {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
  }
}