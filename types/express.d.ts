import "express";

// Extend Express Request to include payload from JWT middleware and multer file
declare global {
  namespace Express {
    interface Request {
      payload?: string; // userId from JWT middleware
      file?: Express.Multer.File | CloudinaryFile; // File from multer middleware (supports both regular and Cloudinary)
    }

    // Cloudinary file type extends Multer.File with additional path property
    interface CloudinaryFile extends Multer.File {
      path: string; // Cloudinary secure URL
      url?: string; // Cloudinary URL (alternative)
      secure_url?: string; // Cloudinary secure URL (alternative)
    }
  }
}

export {};
