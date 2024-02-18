import { Router } from 'express'
import { userLoggedIn } from '../middlewares/isLoggedIn'
import logger from 'winston'

const healthCheck = Router()

healthCheck.post('/health_check', userLoggedIn, (req, res) => {
    logger.info("Appel POST /health_check")
    res.send({ success: true }) 
})

export default healthCheck