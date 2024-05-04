import express from "express";
const router = express.Router();

import { createNewUser } from "../controllers/user.controller";
import { catchErrors } from "../handlers/errorHandlers";

router.post("/", catchErrors(createNewUser));

module.exports = router;
