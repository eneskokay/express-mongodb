import express from "express";
const router = express.Router();

import {
  createNewUser,
  loginUser,
  resendVerificationCode,
  verifyUser,
} from "../controllers/user.controller";
import { catchErrors } from "../handlers/errorHandlers";

router.post("/register", catchErrors(createNewUser));
router.post("/login", catchErrors(loginUser));
router.post("/verify", catchErrors(verifyUser));
router.post("/resendVerificationCode", catchErrors(resendVerificationCode));

module.exports = router;
