const config = require("config");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;
require("winston-mongodb");

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

let logger;

const devlog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.Console({ leve: "debug" }),
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/combine.log", level: "info" }),
  ],
});

const prodlog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    // new transports.Console({ level: "debug" }),
    // new transports.Console({ leve: "debug" }),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.MongoDB({
      db: config.get("ATLAS_URI"),
      oprions: { useUnifiedTopology: true },
    }),
  ],
});

if (process.env.NODE_ENV == "production") {
  logger = prodlog;
} else {
  logger = devlog;
}

logger.exceptions.handle(
  new transports.File({ filename: "log/exseptions.log" })
);
logger.rejections.handle(
  new transports.File({ filename: "log/rejections.log" })
);

logger.exitOnError = false;

module.exports = logger;
