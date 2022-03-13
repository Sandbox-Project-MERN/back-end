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

// @route GET /
// @desc Loads form
router.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) res.status(200).json({ files: false });
    else {
      files.map((file) => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        )
          file.isImage = true;
        else file.isImage = false;
      });

      res.status(200).json({ files: files });
    }
  });
});

// @route GET /files
// @desc  Display all files in JSON
router.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0)
      return res.status(404).json({
        err: "No files exist",
      });

    // Files exist
    return res.json(files);
  });
});

// @route GET /image/:filename
// @desc Display Image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0)
      return res.status(404).json({
        err: "No file exists",
      });

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      gridFSBucket.openDownloadStream(file._id).pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
router.delete("/files/:id", (req, res) => {
  gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
    if (err) return res.status(404).json({ err: err });
  });
});

module.exports = { gfsConnect, router, upload };
