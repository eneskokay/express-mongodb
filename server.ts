import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotevnc from "dotenv";

const app = express();
const port = 3000;

dotevnc.config();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect(process.env.DATABASE_URL || "-");

mongoose.connection.on("error", (error: Error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

// models
require("./src/models/user.model");

// routes
app.use("/user", require("./src/routes/user.routes"));
app.use("/dictionary", require("./src/routes/dictionary.routes"));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
