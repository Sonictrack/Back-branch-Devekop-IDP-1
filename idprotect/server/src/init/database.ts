import { Sequelize } from 'sequelize-typescript'
import Admin from '../models/Admin'
import { ADMIN_ROLE } from '../utils/enums'
import path from 'path'
import logger from "../config/logger";
import  { databaseConfig } from '../config/databaseConfig'

const sequelize = new Sequelize({
  ...databaseConfig,
  modelPaths: [path.join(__dirname, '../', '/models')],
  dialect: 'mysql',
})

// Insert default Admin
sequelize
  .sync()
  .then( async result => {
    return await Admin.findOne({where : { firstname: process.env.SUPER_ADMIN_FIRSTNAME as string }});
  })
  .then( async user => {
    if (!user) {
      return await Admin.create({ 
        role: ADMIN_ROLE.SUPER,
        firstname: process.env.SUPER_ADMIN_FIRSTNAME, 
        lastname: process.env.SUPER_ADMIN_LASTNAME, 
        email: process.env.SUPER_ADMIN_EMAIL, 
        password: process.env.SUPER_ADMIN_PASSWORD, 
        suspended: false,
        lastConnected: new Date() 
      });
    }
    return user;
  })

export default sequelize