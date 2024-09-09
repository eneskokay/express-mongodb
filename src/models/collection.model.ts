import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const collectionSchema = new mongoose.Schema({
  collectionName: {
    type: String,
    required: true,
    unique: true,
  },
  collectionId: {
    type: String,
    required: true,
    unique: true,
  },
  learntWordIDs: [
    {
      type: String,
    },
  ],
}).plugin(uniqueValidator);

export default mongoose.model("Collection", collectionSchema);
