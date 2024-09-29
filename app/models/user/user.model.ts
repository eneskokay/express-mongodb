import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
      unique: true,
      match: [
        /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
        "Please fill a valid email address",
      ],
    },
    active: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    verificationCodeUpdatedAt: Date,
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

    // userDetails: {
    //   nativeLanguage: {
    //     type: String,
    //     required: true,
    //   },
    //   englishLevel: {
    //     type: String,
    //     enum: ["LVL_BEGINNER", "LVL_INTERMEDIATE", "LVL_ADVANCED"],
    //     required: true,
    //   },
    //   interestedTopics: {
    //     type: [
    //       "TPC_BUSINESS",
    //       "TPC_SCIENCE",
    //       "TPC_TECHNOLOGY",
    //       "TPC_ARTS",
    //       "TPC_SPORTS",
    //     ],
    //     required: true,
    //   },
    // },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
