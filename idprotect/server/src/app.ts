import express from 'express'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import flash from 'connect-flash'

import { SESSION_COOKIE_NAME } from './utils/constants'
import './init/database'

import indexRouter from './routes/logout'
import adminRouter from './routes/admin'
import clientRouter from './routes/client'

const MySQLStore = require('express-mysql-session')(session);
import { databaseConfig } from './config/databaseConfig'

let origin: true | string[] = true;
if (process.env.NODE_ENV === 'production') {
  origin = ['https://id-protect-v2-preprod-fee0e714ea51.herokuapp.com'];
} else if (process.env.NODE_ENV === 'development') {
  origin = ['https://idprotect-staging.herokuapp.com'];
} else { 
  origin = ['http://localhost:8081'];
}

let cookieDomain: string;
if (process.env.NODE_ENV === 'production') {
  cookieDomain = '.idprotect.fr'; // valide pour tous les sous-domaines de idprotect.fr
} else if (process.env.NODE_ENV === 'development') {
  cookieDomain = '.herokuapp.com'; // si vous voulez qu'il soit valide pour tous les sous-domaines de herokuapp.com
} else { 
  cookieDomain = 'localhost'; // pour l'environnement local
}


const app = express()

app.use(helmet())
app.use(cors({ credentials: true, origin }))
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload())
app.use(flash())
app.set('trust proxy', 1)
const sessionStore = new MySQLStore(databaseConfig)

const isSecure = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development';

app.use(session({
  name: SESSION_COOKIE_NAME,
  secret: process.env.SESSION_SECRET as string,
  store: sessionStore,
  resave: true,
  saveUninitialized: false,
  unset: 'destroy',
  proxy: true,
  cookie: {
    path: '/',
    // httpOnly: true,
    httpOnly: true,
    maxAge: 4 * 60 * 60 * 1000,
    // secure: isSecure,
    secure: false,
    sameSite: 'strict',
    domain: process.env.FRON_URL_WITHOUT_HTTP as string
    // domain: cookieDomain
  }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/client', clientRouter)
app.use('/admin', adminRouter)
app.use('/', indexRouter)

export default app