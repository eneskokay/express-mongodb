import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const categorySchema = new mongoose.Schema({
  categoryId: {
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

export default mongoose.model("Category", categorySchema);
