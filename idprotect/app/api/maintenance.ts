import { userTypeChoice } from "./utils";
import { UserType } from "../components/enums/userType"


export function healthCheck (userType: UserType): Promise<Response> {
    let url = userTypeChoice(userType, 'health_check')
    const body = new FormData()
    body.append('type', userType)  
    return fetch(url, { method: 'POST', body, credentials: 'include' })
}