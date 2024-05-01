const express = require("express");
const router = express.Router();

import { createNewUser } from "./user.controller";

router.get("/", createNewUser);

module.exports = router;
