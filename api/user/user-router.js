const express = require("express");
const router = express.Router();
const { requireAuth } = require("../general-middleware/jwt-auth");
const UserService = require("../user/user-service");

router.get("/", (req, res, next) => {
  UserService.getAllUsers().then((users) => res.status(200).json(users));
});

router.put("/update", requireAuth, (req, res, next) => {
  UserService.updateUser(req.body.email, req.body).then((updatedUser) =>
    res.status(201).json(updatedUser)
  );
});

module.exports = router;
