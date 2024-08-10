import express from "express";
import {
  addWordToCollection,
  createCollection,
  removeWordFromCollection,
  getWordsFromCollection,
} from "../controllers/words.controller";
import { catchErrors } from "../handlers/errorHandlers";
import { isAuthorized } from "../middlewares/authorization";
const router = express.Router();

router.get(
  "/getWordsPartially",
  isAuthorized,
  catchErrors(getWordsFromCollection)
);

router.post("/createCollection", isAuthorized, catchErrors(createCollection));

router.post(
  "/addWordToCollection",
  isAuthorized,
  catchErrors(addWordToCollection)
);

router.post(
  "/removeWordFromCollection",
  isAuthorized,
  catchErrors(removeWordFromCollection)
);

module.exports = router;
