import mongoose from "mongoose";

// src/index.js
const express = require("express");

require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL || "-");

const app = express();
const port = 3000;

app.use("/user", require("./src/entities/user/user.routes"));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
