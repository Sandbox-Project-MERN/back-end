const express = require("express");
const router = express.Router();
const { requireAuth } = require("../general-middleware/jwt-auth");
const {
  emailAlreadyExists,
  userAlreadyHasImage,
} = require("./user-middleware");
const UserService = require("../user/user-service");
const ImageService = require("../image/image-service");
const bodyParser = require("body-parser");

// get all users
router.get("/", (req, res, next) => {
  UserService.getAllUsers().then((users) => res.status(200).json(users));
});

// get user info by _id
router.get("/:_id", requireAuth, (req, res, next) => {
  UserService.getUserWhere({ _id: req.params._id }).then((user) =>
    res.status(200).json(user)
  );
});

// update a users information
router.put(
  "/update/:_id",
  requireAuth,
  emailAlreadyExists,
  (req, res, next) => {
    UserService.updateUser(req.params._id, req.body).then((updatedUser) =>
      res.status(201).json(updatedUser)
    );
  }
);

router.post(
  "/image-upload/:_id",
  bodyParser.json(),
  userAlreadyHasImage,
  ImageService.uploadImage(),
  (req, res, next) => {
    const { filename, id } = req.file;

    UserService.updateUser(req.params._id, {
      photo_url: filename,
      photo_id: id,
    }).then((updatedUser) => res.status(201).json(updatedUser));
  }
);

module.exports = router;
