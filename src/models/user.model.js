const mongoose = require("mongoose");

// Describing structure
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 7,
  },
  email: {
    type: String,
    required: true,
  },
});

// Creating Collections
const User = new mongoose.model("User", userSchema);

module.exports = User;
