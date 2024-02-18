import { Router } from 'express'
import logger from '../config/logger'
import { SESSION_COOKIE_NAME } from '../utils/constants'

const logout = Router()

logout.get('/logout', (req, res) => {
  logger.debug("Deconnexion de l'utilisateur.")
  req.logout()
  res.clearCookie(SESSION_COOKIE_NAME, {path: '/'})
  res.json({ success: true })
})

export default logout
