const express = require("express");
const router = express.Router();
const { requireAuth } = require("../general-middleware/jwt-auth");
const { emailAlreadyExists } = require("./user-middleware");
const UserService = require("../user/user-service");
const ImageService = require("../image/image-service");
const bodyParser = require("body-parser");

// get all users
router.get("/", (req, res, next) => {
  setTimeout(() => {
    UserService.getAllUsers().then((users) => res.status(200).json(users));
  }, 3000);
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
    setTimeout(() => {
      UserService.updateUser(req.params._id, req.body).then((updatedUser) =>
        res.status(201).json(updatedUser)
      );
    }, 1000);
  }
);

router.post(
  "/image-upload/:_id",
  bodyParser.json(),
  ImageService.uploadImage(),
  (req, res, next) => {
    console.log(req.file, req.files, "hereI am");

    const { filename, id } = req.file;

    setTimeout(() => {
      UserService.updateUser(req.params._id, {
        photo_url: filename,
        photo_id: id,
      }).then((updatedUser) => res.status(201).json(updatedUser));
    }, 1000);
  }
);

module.exports = router;
