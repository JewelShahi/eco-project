const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mnumber: { type: String },
    address: { type: String },
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
