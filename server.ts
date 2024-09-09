import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { globSync } from "glob";
import path from "path";

const app = express();
const port = 3000;

const envFile = process.env.NODE_ENV === "TEST" ? ".env.test" : ".env";

dotenv.config({ path: envFile });

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect(process.env.DATABASE_URL || "-");

mongoose.connection.on("error", (error: Error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

const modelFiles = globSync("./src/models/**/*.ts");

for (const filePath of modelFiles) {
  require(path.resolve(filePath));
}

// routes
app.use("/user", require("./src/routes/user.routes"));
app.use("/dictionary", require("./src/routes/promtDictionary.routes"));
app.use("/words", require("./src/routes/words.routes"));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

module.exports = app;
