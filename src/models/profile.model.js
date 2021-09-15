const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    profession: String,
    DOB: String,
    titleline: String,
    about: String,
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamp: true,
  },
);

const Profile = new mongoose.model("Profile", profileSchema);

module.exports = Profile;
