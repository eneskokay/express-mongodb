import express from "express";
import {
  addWordToCollection,
  createCollection,
  removeWordFromCollection,
  getWordsPartially,
  deleteCollection,
  getAllCollections,
} from "../controllers/words.controller";
import { catchErrors } from "../handlers/errorHandlers";
import { isAuthorized } from "../middlewares/authorization";
const router = express.Router();

router.get("/getWordsPartially", isAuthorized, catchErrors(getWordsPartially));
router.get("/getAllCollections", isAuthorized, catchErrors(getAllCollections));
router.post("/createCollection", isAuthorized, catchErrors(createCollection));
router.delete("/deleteCollection", isAuthorized, catchErrors(deleteCollection));
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
