"use strict";
// multer stores and handles the uploaded file in server-side.
// MongoDB stores the name of folder in which multer has stored the uploaded file.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// storage
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, "./uploads");
    },
    filename: (_req, file, callback) => {
        const filename = `image-${Date.now()}-${file.originalname}`;
        callback(null, filename);
    },
});
// filter
const fileFilter = (_req, file, callback) => {
    if (file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg") {
        callback(null, true);
    }
    else {
        callback(null, false);
        callback(new Error("Only png, jpg, jpeg files are allowed."));
    }
};
const multerConfig = (0, multer_1.default)({
    storage,
    fileFilter,
});
exports.default = multerConfig;
//# sourceMappingURL=multerMiddleware.js.map