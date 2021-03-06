const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  description: { type: String, required: true },
  password: { type: String, required: true },
  photo_url: { type: String, required: false },
  photo_id: { type: String, required: false },
  date_created: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
