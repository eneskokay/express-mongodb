import * as yup from "yup";

export const deleteCollectionSchema = yup.object({
  collectionId: yup.string().required(),
});

export const createCollectionSchema = yup.object({
  collectionName: yup.string().required(),
});

export const addWordToCollectionSchema = yup.object({
  wordId: yup.string().required(),
  collectionId: yup.string().required(),
});

export const removeWordFromCollectionSchema = yup.object({
  wordId: yup.string().required(),
  collectionId: yup.string().required(),
});
