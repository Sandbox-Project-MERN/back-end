require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../../api/user/user-model");

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const userData = [
  {
    email: "guest@gmail.com",
    full_name: "Guest User",
    description: "here is a little about me as a guest user",
    password: bcrypt.hashSync("guestPassword!!11$", 1),
  },
];

User.remove({}, function (err, removed) {
  if (err) console.log("Database Error: ", err);

  User.create(userData, function (err, users) {
    if (err) console.log("Database Error: ", err);

    console.log("Users inserted: ", users);
    process.exit();
  });
});
