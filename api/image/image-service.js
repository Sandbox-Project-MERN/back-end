const { upload } = require("./image-router");

const ImageService = {
  uploadImage: () => upload.single("file"),
};

module.exports = ImageService;
