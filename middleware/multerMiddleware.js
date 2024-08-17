// multer stores and handles the uploaded file in server-side.
// MongoDB stores the name of folder in which multer has stored the uploaded file.

const multer = require("multer");

// storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    const filename = `image-${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

// filter
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(new Error("Only png, jpg, jpeg files are allowed."));
  }
};

const multerConfig = multer({
  storage,
  fileFilter,
});

module.exports = multerConfig;
