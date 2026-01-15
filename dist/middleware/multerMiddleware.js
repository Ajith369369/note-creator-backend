// multer stores and handles the uploaded file in server-side using Cloudinary.
// MongoDB stores the Cloudinary URL of the uploaded file.
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
// Enterprise-grade file filter with proper MIME type checking
const fileFilter = (_req, file, callback) => {
    // Strict MIME type validation
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    }
    else {
        callback(new Error(`Invalid file type. Only ${allowedMimeTypes.join(", ")} are allowed.`));
    }
};
const cloudinaryParams = {
    folder: "note-creator-uploads", // Organized folder structure
    allowed_formats: ["jpg", "jpeg", "png"], // Explicit format restriction
    resource_type: "image",
    // Enterprise optimizations
    transformation: [
        {
            quality: "auto:good", // Automatic quality optimization
            fetch_format: "auto", // Auto WebP when supported
            width: 1920, // Max width for optimization
            height: 1080, // Max height for optimization
            crop: "limit", // Don't crop, just limit size
        },
    ],
    // Generate unique filename
    public_id: (_req, file) => {
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        return `image-${timestamp}-${sanitizedName}`;
    },
};
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: cloudinaryParams, // Type assertion needed due to incomplete library types
});
// Multer configuration with limits for security
const multerConfig = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit (enterprise standard)
        files: 1, // Single file upload
    },
});
export default multerConfig;
//# sourceMappingURL=multerMiddleware.js.map