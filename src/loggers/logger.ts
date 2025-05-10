import winston from "winston";
const { combine, errors, json, timestamp, colorize } = winston.format;

const logger = winston.createLogger({
  format: combine(
    errors({ stack: true }),
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
    json()
  ),
  transports: [
    new winston.transports.File({ filename: "errors.log", level: "errors"}),
    new winston.transports.File({ filename: "combined.log"})
  ]
});

if(process.env.NODE_ENV !== "productions"){
    logger.add(
        new winston.transports.Console({ format: winston.format.simple() })
    )
}

export default logger