import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const categorySchema = new mongoose.Schema({
  words: [
    {
      type: String,
      ref: "Word",
    },
  ],
}).plugin(uniqueValidator);

export default mongoose.model("Category", categorySchema);
