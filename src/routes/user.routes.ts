import express, { NextFunction } from "express";
const router = express.Router();

import {
  createNewUser,
  getUserInfos,
  loginViaEmail,
  resendVerificationCode,
  verifyUser,
} from "../controllers/user.controller";
import { catchErrors } from "../handlers/errorHandlers";
import { isAuthorized } from "../middlewares/authorization";

router.post("/register", catchErrors(createNewUser));
router.post("/loginViaEmail", catchErrors(loginViaEmail));
router.post("/verify", catchErrors(verifyUser));
router.post("/resendVerificationCode", catchErrors(resendVerificationCode));
router.get("/userInfos", isAuthorized, catchErrors(getUserInfos));

module.exports = router;
