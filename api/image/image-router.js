const express = require("express");
const router = express.Router();
const { ATLAS_URI } = require("../config");

const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

let gfs;
let gridFSBucket;

const gfsConnect = (connection, mongooseMongo) => {
  gfs = Grid(connection.db, mongooseMongo);
  gfs.collection("user_images");

  gridFSBucket = new mongooseMongo.GridFSBucket(connection.db, {
    bucketName: "user_images",
  });
};

const storage = new GridFsStorage({
  url: ATLAS_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        const filename = buf.toString("hex") + path.extname(file.originalname);

        const fileInfo = {
          filename: filename,
          bucketName: "user_images",
        };

        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

const deleteImage = (_id) => {
  gfs.remove({ _id, root: "user_images" }, (err, gridStore) => {
    if (err) next({ status: 404, message: "Not an image" });
  });
};

// @route GET api/image/:filename
// @desc Display Image
router.get("/:filename", (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0)
      return next({ status: 404, message: "No Image Found" });

    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      gridFSBucket.openDownloadStream(file._id).pipe(res);
    } else next({ status: 404, message: "Not an image" });
  });
});

module.exports = { gfsConnect, router, upload, deleteImage };
