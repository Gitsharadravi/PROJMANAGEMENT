 
 import winston from 'winston'; 
 import { createLogger, format, transports } from 'winston';
 const { combine, timestamp, label, printf, colorize } = format;

 const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}  [${level}] ${message}`;
});

const projectLogger = () => {
 return winston.createLogger({
  level: 'debug', 
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json(), // Standard for production
    myFormat
  ),
  
  transports: [ new winston.transports.Console()],
});
}


export {projectLogger};

 
 
  



