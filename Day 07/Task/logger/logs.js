const winston = require('winston');
const {combine, timestamp, json, prettyPrint, errors} = winston.format

const infoFilter = winston.format((info) => {
    return info.level === 'info' ? info : false;
})

const errorFilter = winston.format((info) => {
    return info.level === 'error' ? info : false;
})

const warnFilter = winston.format((info) => {
    return info.level === 'warn' ? info : false;
})


const logger = winston.createLogger({
    colorize: true,

    level: 'info',

    transports:[
        // new winston.transports.Console(),
        new winston.transports.File({
            level:'info',
            filename: "log files/info.log",
            format: combine(
                infoFilter(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                json(),
                prettyPrint()

            )
        }),

        new winston.transports.File({
            level: 'error',
            filename: 'log files/error.log',
            format: combine(
                errorFilter(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                json(),
                prettyPrint()
            )
        }),

        new winston.transports.File({
            level: 'warn',
            filename: 'log files/warn.log',
            format: combine(
                warnFilter(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                json(),
                prettyPrint()
            )
          })          
    ]  
})


module.exports=logger;