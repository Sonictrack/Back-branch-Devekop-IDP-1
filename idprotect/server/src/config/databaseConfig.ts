import { SequelizeOptions } from 'sequelize-typescript'

const databaseConfig = {
    dialect: process.env.DATABASE_DIALECT,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialectOptions: {
      connectTimeout: Number(process.env.DATABASE_DO_ACQUIRE)
    },
    pool: {
      max: Number(process.env.DATABASE_POOL_MAX),
      min: Number(process.env.DATABASE_POOL_MIN),
      acquire: Number(process.env.DATABASE_POOL_ACQUIRE),
      idle: Number(process.env.DATABASE_POOL_IDLE)
    }
  } as SequelizeOptions

  export { databaseConfig }
