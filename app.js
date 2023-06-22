const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./middleware/error_handling_middleware");
const PORT = config.get("port") || 3030;
const cookieParser = require("cookie-parser");
const expressWinston = require("express-winston");
const winston = require("winston");

const logger = require("./services/logger");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

console.log(process.env.NODE_ENV);
console.log(process.env.secret);
console.log(config.get("secret"));
console.log(config.get("access_key"));

console.log("LOG ma'lumotlari");
console.error("ERROR ma'lumotlari");
console.debug("DEBUG ma'lumotlari ");
console.warn("WARN ma'lumotlari");
console.info("INFO ma'lumotlari");
console.trace("TRACE ma'lumotlari");
// console.table([
//   ["salim", "20"],
//   ["karim","23"]

// ])

// logger.log("LOG ma'lumotlari");
logger.error("ERROR ma'lumotlari");
logger.debug("DEBUG ma'lumotlari ");
logger.warn("WARN ma'lumotlari");
logger.info("INFO ma'lumotlari");
// logger.trace("TRACE ma'lumotlari");

const app = express();
app.use(error_handling_middleware);
app.use(express.json()); // frontentdan kelayotgan surovlarni jsonga pars qiladi yoki tanidi
app.use(cookieParser()); // frontent kelayotgan suroblar ichidagi coocelarni tanish un

// process.on("uncaughtException", (ex) => {
//   console.log("uncaughtException:", ex.message);
//   process.exit(1);
// });
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);

app.use("/api", mainRouter);
  app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
    })
  );
async function start() {
  try {
    await mongoose.connect(config.get("ATLAS_URI"));

    app.listen(PORT, () => {
      console.log(`Server ${PORT}-da ishga tushdi`);
    });
  } catch (error) {
    console.log("Serverda xatolik");
    console.log(error);
  }
}

start();
