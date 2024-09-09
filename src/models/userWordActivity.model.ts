import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userWordActivitySchema = new mongoose.Schema({
  userId: String,
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  collections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  ],
  wordsToNotify: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Word",
    },
  ],
}).plugin(uniqueValidator);

export default mongoose.model("UserWordActivity", userWordActivitySchema);
