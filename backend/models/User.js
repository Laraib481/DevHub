const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // --- Email verification & password reset ---
    // isVerified intentionally has NO default so that existing users
    // (created before this feature) keep `undefined` and are treated as
    // already-verified by the login logic. Newly registered users are
    // explicitly created with `isVerified: false` in the signup controller.
    isVerified: {
      type: Boolean,
    },
    // OTPs are stored HASHED (bcrypt), never in plain text, so a database
    // leak does not expose usable codes. They are cleared after use.
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpiry: {
      type: Date,
      default: null,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpiry: {
      type: Date,
      default: null,
    },

    role: {
      type: String,
      default: "Developer",
    },
    bio: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    publicNotes: {
      type: [String],
      default: [],
    },
    publicSnippets: {
      type: [String],
      default: [],
    },
    publicResources: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);