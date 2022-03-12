const express = require("express");
const router = express.Router();
const { requireAuth } = require("../general-middleware/jwt-auth");
const { emailAlreadyExists } = require("./user-middleware");
const UserService = require("../user/user-service");

router.get("/", (req, res, next) => {
  UserService.getAllUsers().then((users) => res.status(200).json(users));
});

router.put("/update/:_id", emailAlreadyExists, (req, res, next) => {
  UserService.updateUser(req.params._id, req.body).then((updatedUser) =>
    res.status(201).json(updatedUser)
  );
});

module.exports = router;
