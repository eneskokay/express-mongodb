import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userDetails: {
    nativeLanguage: {
      type: String,
      required: true,
    },
    englishLevel: {
      type: String,
      enum: ["LVL_BEGINNER", "LVL_INTERMEDIATE", "LVL_ADVANCED"],
      required: true,
    },
    interestedTopics: {
      type: [
        "TPC_BUSINESS",
        "TPC_SCIENCE",
        "TPC_TECHNOLOGY",
        "TPC_ARTS",
        "TPC_SPORTS",
      ],
      required: true,
    },
  },
});

export default mongoose.model("user", userSchema);
