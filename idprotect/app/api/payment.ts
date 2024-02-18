import { userTypeChoice, JsonHeaders } from "./utils";
import { UserType } from "../components/enums/userType"

export function emailAfterPaymentAnonymous(email: string, amount: string) {
    const url = userTypeChoice(UserType.client, "payment_anonymous")
    const body = new FormData()
    body.append('email', email)
    body.append('amount', amount)
    return fetch(url, { method: "POST", body })
}

export function emailAfterPayment(type: UserType, amount: string) {
    const url = userTypeChoice(type, "payment")
    const body = new FormData()
    body.append('amount', amount)
    body.append('type', type)
    return fetch(url, { method: "POST", body, credentials: 'include' })
}

export function paymentIntent(data: any) {
    const url = userTypeChoice(UserType.client, "payment_intent")
    return fetch(url, { method: "POST", body: JSON.stringify(data), headers: JsonHeaders() })
}

export function giveCredits(type: UserType, email: string, amount: string) {
    const url = userTypeChoice(type, "add_credits")
    const body = new FormData()
    body.append('credits', amount)
    body.append('email', email)
    body.append('type', type)
    return fetch(url, { method: "POST", body, credentials: 'include' }) 
}

export function getGivenCreditsHistory(type: UserType) {
    const url = userTypeChoice(type, "get_credits_history")
    const body = new FormData()
    body.append('type', type)
    return fetch(url, { method: "POST", body, credentials: 'include' }) 
}