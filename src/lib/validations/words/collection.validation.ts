import * as yup from "yup";

export const deleteCollectionSchema = yup.object({
  collectionId: yup.string().required(),
});
