const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.routes");
const PORT = config.get("port") || 3030;

const app = express();

app.use(express.json());
 
app.use("/api",mainRouter);

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
