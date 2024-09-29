import {
  deleteCollectionSchema,
  createCollectionSchema,
  addWordToCollectionSchema,
  removeWordFromCollectionSchema,
} from "./words/collection.validation";

const validationSchemas = {
  deleteCollectionSchema: deleteCollectionSchema,
  createCollectionSchema: createCollectionSchema,
  addWordToCollectionSchema: addWordToCollectionSchema,
  removeWordFromCollectionSchema: removeWordFromCollectionSchema,
};

export default validationSchemas;
