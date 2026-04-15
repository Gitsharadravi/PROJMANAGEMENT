import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";
dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 3000;

connectDB()
  .then(() =>{
    app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
  }); 
  })
  .catch((err) => {
  console.log("MongoDB connection error", err);
  process.exit(1)  //exit if the connection fail
  })    

  import { logger } from "./logger/index.js";
  logger.warn("warn information")
  logger.info("info information")
  logger.debug("debug information")