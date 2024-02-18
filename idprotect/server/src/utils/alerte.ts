import sequelize from '../init/database'
import logger from '../config/logger'
import Alerte from '../models/Alerte'

async function alerte(user: string , service: string, action: string, message: string){
    try {
        await sequelize.transaction( async (transaction) => {
            const alerte = Alerte.create({user, service, action, message}, {transaction})
            if(!alerte){
                logger.error("Anomalie lors la génération de l'alerte.")
            }
        })

    } catch(e){
        logger.error(`Anomalie lors la génération de l'alerte : ${e.message}.`)
    }
}

export { alerte }