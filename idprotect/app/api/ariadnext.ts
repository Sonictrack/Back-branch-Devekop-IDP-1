import { userTypeChoice } from './utils';
import { UserType } from '../components/enums/userType';

export function healthcheck (type: UserType, domain: string): Promise<Response> {
  const url = userTypeChoice(type, 'ariadnext/healthcheck');
  const body = new FormData()
  body.append('type', type)
  body.append('domain', domain)
  return fetch(url, { method: 'POST', body, credentials: 'include' });
}

export function userInfo (type: UserType, domain: string): Promise<Response> {
  const url = userTypeChoice(type, 'ariadnext/user');
  const body = new FormData()
  body.append('type', type)
  body.append('domain', domain)
  return fetch(url, { method: 'POST', body, credentials: 'include' });
}

export function documentAnalysis (type: UserType, recto: string, verso: string, domain: string): Promise<Response> {
  const url = userTypeChoice(type, 'ariadnext/analysis');
  const body = new FormData()
  body.append('type', type)
  body.append('recto', recto)
  body.append('verso', verso)
  body.append('domain', domain)
  return fetch(url, { method: 'POST', body, credentials: 'include' });
}

export function getHistoriques (type: UserType): Promise<Response> {
  const url = userTypeChoice(type, 'ariadnext/historiques');
  const body = new FormData()
  body.append('type', type)
  return fetch(url, { method: 'POST', body, credentials: 'include' });
}

