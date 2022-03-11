require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../../src/models/user-model");

const { makeFixtures } = require("./dbcontent.fixtures");

// create dummy data
const { users } = makeFixtures();

// we will iterate through this array as we seed each table in our database
const toSeed = [
  {
    name: "Users",
    model: User,
    data: users.map((el) => {
      el.password = bcrypt.hashSync(el.password, 1);
      return el;
    }),
  },
];

// function to call which will seed our database
const seedTestTables = (url) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  toSeed.forEach((el) => {
    el.model.deleteMany({}, function (err, removed) {
      if (err) {
        console.log("Database Error: ", err);
      }

      el.model.create(el.data, function (err, data) {
        if (err) {
          console.log("Database Error: ", err);
        }

        console.log(`${el.name} inserted`);
      });
    });
  });
};

module.exports = seedTestTables;
