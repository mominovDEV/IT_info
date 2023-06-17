const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./middleware/error_handling_middleware");
const PORT = config.get("port") || 3030;
const cookieParser = require("cookie-parser");

const app = express();
app.use(error_handling_middleware);
app.use(express.json());

app.use("/api", mainRouter);
app.use(cookieParser());
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
