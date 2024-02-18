import {createLogger, format, transports } from 'winston'

const idProtectLog = createLogger({
    format: format.combine(
        format.simple(), 
        format.timestamp(),
        format.printf( info => `[${info.timestamp}] ${info.level} ${info.message}`),
        ),
    transports: [
        new transports.File({
            maxsize: Number(process.env.LOGGER_FILE_MAXSIZE),
            maxFiles: Number(process.env.LOGGER_FILE_MAXFILES),
            filename: process.env.LOGGER_FILE,
            level: process.env.LOGGER_FILE_LEVEL
        }),
        new transports.Console({
            level: process.env.LOGGER_CONSOLE_LEVEL
        })
    ]
}) 

export default idProtectLog