const expressWinston = require("express-winston");
const {format, transports } = require("winston");
const { metadata, json, prettyPrint} = format;
const { logger, errorLogger } = require("express-winston");
const winston = require("winston");
const config = require("config");
require("winston-mongodb");

const expressWinstonLogger = expressWinston.logger({
  transports: [
      new transports.MongoDB({
          db: config.get("ATLAS_URI"),
          options: { useUnifiedTopology: true },
          metaKey: "meta",
        }),
        new transports.Console(),
  ],
  format: combine(timestamp(), prettyPrint(), metadata()),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return false;
  },
});

const expressWinstonErrorLogger = errorLogger({
  transports: [
    new transports.Console(),

    new transports.MongoDB({
      db: config.get("ATLAS_URI"),
      options: { useUnifiedTopology: true },
      storeHost: true,
      capped: true,
    }),
  ],
  format: format.combine(format.colorize(), format.metadata()),
});

module.exports = {
  expressWinstonLogger,
  expressWinstonErrorLogger,
};
