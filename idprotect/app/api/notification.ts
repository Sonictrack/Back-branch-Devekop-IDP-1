import { userTypeChoice } from "./utils";
import { UserType } from "../components/enums/userType";

export function getNotifcations (type: UserType): Promise<Response> {
    const url = userTypeChoice(type, "notifications")
    const body = new FormData()
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
  }
  
  export function sendNotifcation (type: UserType, notification: Object): Promise<Response> {
    const url = userTypeChoice(type, "notification")
    const body = new FormData()
    body.append('notification', JSON.stringify(notification))
    body.append('type', type)
    return fetch(url, { method: 'POST', body, credentials: 'include' })
  }