// multer stores and handles the uploaded file in server-side.
// MongoDB stores the name of folder in which multer has stored the uploaded file.

import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
    callback(null, "./uploads");
  },
  filename: (_req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
    const filename = `image-${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

// filter
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
    callback(new Error("Only png, jpg, jpeg files are allowed."));
  }
};

const multerConfig = multer({
  storage,
  fileFilter,
});

export default multerConfig;

