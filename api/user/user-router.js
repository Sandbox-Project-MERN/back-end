const express = require("express");
const router = express.Router();
const { requireAuth } = require("../general-middleware/jwt-auth");
const { emailAlreadyExists } = require("./user-middleware");
const UserService = require("../user/user-service");
const ImageService = require("../image/image-service");

// get all users
router.get("/", (req, res, next) => {
  UserService.getAllUsers().then((users) => res.status(200).json(users));
});

// get user info by _id
router.get("/:_id", (req, res, next) => {
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
  "/upload/image/:_id",
  ImageService.uploadImage(),
  (req, res, next) => {
    setTimeout(() => {
      // UserService.updateUser(req.params._id, req.body).then((updatedUser) =>
      //   res.status(201).json(updatedUser)
      // );

      res.status(200).json(req.file);
    }, 1000);
  }
);

module.exports = router;
