 
 import winston from 'winston'; 
 import { createLogger, format, transports } from 'winston';
 const { combine, timestamp, label, printf, colorize } = format;

 const myFormat = printf(({ level, message, label, timestamp }) => {
  return `[${level}] ${timestamp}   ${message}`;
});

const productionLogger = () => {
 return winston.createLogger({
  level: 'info', 
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json(), // Standard for production
    myFormat
  ),
  
  transports: [ 
    new winston.transports.Console(),
    new winston.transports.File({filename: "myErrors.log"})
],
});
}

export {productionLogger};

 
 
  



