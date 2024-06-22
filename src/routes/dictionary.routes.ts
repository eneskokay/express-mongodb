import express from "express";
const router = express.Router();

import { catchErrors } from "../handlers/errorHandlers";
import { isAuthorized } from "../middlewares/authorization";
import { getPromtResult } from "../controllers/dictionary.controller";

router.get("/promt", isAuthorized, catchErrors(getPromtResult));

module.exports = router;
