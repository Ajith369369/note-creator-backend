import "express";

// Extend Express Request to include payload from JWT middleware and multer file
declare global {
  namespace Express {
    interface Request {
      payload?: string; // userId from JWT middleware
      file?: Express.Multer.File; // File from multer middleware
    }
  }
}

export {};
