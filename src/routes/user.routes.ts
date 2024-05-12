import express from "express";
const router = express.Router();

import {
  createNewUser,
  loginUser,
  verifyUser,
} from "../controllers/user.controller";
import { catchErrors } from "../handlers/errorHandlers";

router.post("/register", catchErrors(createNewUser));
router.post("/login", catchErrors(loginUser));
router.post("/verify", catchErrors(verifyUser));

module.exports = router;
