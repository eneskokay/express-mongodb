import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const collectionSchema = new mongoose.Schema({
  collectionName: {
    type: String,
    required: true,
    unique: true,
  },
  words: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Word",
    },
  ],
}).plugin(uniqueValidator);

export default mongoose.model("Collection", collectionSchema);
