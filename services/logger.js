const { createLogger,format, transports } = require("winston");
const winston = require("winston/lib/winston/config");
const { combine, timestamp , printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}${level}: ${message}`;
});

const logger = winston.createLogger({
    format:combine(timestamp(), myFormat,json()),
  transports: [new winston.transports.Console({level:"debug"})],
});

module.exports = logger;
