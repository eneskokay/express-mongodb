import mongoose from "mongoose";

export const wordSchema = new mongoose.Schema({
  name: String,
  category: String,
  meanings: [
    {
      name: String,
      description: String,
      samples: [String],
      Synonyms: [String],
    },
  ],
});

export const userWordActivitySchema = new mongoose.Schema({
  userId: String,
  categories: [
    {
      categoryKey: {
        type: String,
        required: true,
        unique: true, // Ensures categoryKey is unique
      },
      learntWordIDs: [
        {
          type: String,
        },
      ],
    },
  ],
  collections: [
    {
      collectionKey: {
        type: String,
        required: true,
        unique: true, // Ensures collectionKey is unique
      },
      learntWordIDs: [
        {
          type: String,
        },
      ],
    },
  ],
  wordsToNotify: [wordSchema],
});
