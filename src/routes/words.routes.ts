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
import validationSchemas from "../lib/validations/validations";
const router = express.Router();

router.get("/getWordsPartially", isAuthorized, catchErrors(getWordsPartially));
router.get("/getAllCollections", isAuthorized, catchErrors(getAllCollections));
router.post(
  "/createCollection",
  isAuthorized,
  (req, res, next) =>
    validationMiddleware(
      req,
      res,
      next,
      validationSchemas.createCollectionSchema
    ),
  catchErrors(createCollection)
);
router.delete(
  "/deleteCollection",
  isAuthorized,
  (req, res, next) =>
    validationMiddleware(
      req,
      res,
      next,
      validationSchemas.deleteCollectionSchema
    ),
  catchErrors(deleteCollection)
);
router.post(
  "/addWordToCollection",
  isAuthorized,
  (req, res, next) =>
    validationMiddleware(
      req,
      res,
      next,
      validationSchemas.addWordToCollectionSchema
    ),
  catchErrors(addWordToCollection)
);
router.delete(
  "/removeWordFromCollection",
  isAuthorized,
  (req, res, next) =>
    validationMiddleware(
      req,
      res,
      next,
      validationSchemas.removeWordFromCollectionSchema
    ),
  catchErrors(removeWordFromCollection)
);

module.exports = router;
