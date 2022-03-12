const express = require("express");
const router = express.Router();
const { requireAuth } = require("../general-middleware/jwt-auth");
const UserService = require("../user/user-service");

router.get("/", requireAuth, (req, res, next) => {
  UserService.getAllUsers().then((users) => res.status(200).json(users));
});

module.exports = router;
