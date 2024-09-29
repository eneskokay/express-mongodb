import mongoose from "mongoose";

export const wordSchema = new mongoose.Schema({
  name: String,
  CEFR: String,
  meanings: [
    {
      title: String,
      description: String,
      form: ["noun", "verb", "adjective", "adverb"],
      samples: [String],
      synonyms: [String],
    },
  ],
});

export default mongoose.model("Word", wordSchema);
