import express, { Response } from "express";
import {
  addWordToCollection,
  createCollection,
  removeWordFromCollection,
  getWordsPartially,
  deleteCollection,
  getAllCollections,
} from "../controllers/words.controller";
import { catchErrors } from "../lib/handlers/errorHandlers";
import { isAuthorized } from "../middlewares/authorization";
import validationMiddleware from "../middlewares/validation.middleware";
import { deleteCollectionSchema } from "../lib/validations/words/collection.validation";
const router = express.Router();

router.get("/getWordsPartially", isAuthorized, catchErrors(getWordsPartially));
router.get("/getAllCollections", isAuthorized, catchErrors(getAllCollections));
router.post("/createCollection", isAuthorized, catchErrors(createCollection));
router.delete(
  "/deleteCollection",
  isAuthorized,
  (req, res: Response, next) =>
    validationMiddleware(req, res, next, deleteCollectionSchema),
  catchErrors(deleteCollection)
);
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
