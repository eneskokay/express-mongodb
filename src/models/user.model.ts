import mongoose from "mongoose";

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
      validate: {
        validator: async function (email: string) {
          const user = await (this.constructor as any).findOne({ email });
          if (user && user.active) return false;
          if (
            user &&
            !user.active &&
            user.createdAt > new Date(Date.now() - 600000)
          ) {
            return false;
          }
          if (user && !user.active) {
            await (this.constructor as any).deleteOne({ email });
          }
          return true;
        },
      },
    },
    password: {
      type: String,
      required: true,
      min: 8,
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Password must be at least 8 characters long and contain at least one lowercase, one uppercase, one number.",
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

export default mongoose.model("user", userSchema);
