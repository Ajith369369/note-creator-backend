// #region Multi-line Comment
/**
 * Image deletion utility with Cloudinary support.
 * Supports both Cloudinary URLs and legacy local file paths for backward compatibility.
 */
// #endregion
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { deleteFromCloudinary } from "./cloudinary.js";

// ES modules don't have __dirname, so we need to create it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// #region Multi-line Comment
/**
 * Delete image from Cloudinary or local filesystem (enterprise-grade)
 * Supports both Cloudinary URLs and legacy local file paths
 * @param imageUrlOrId - Cloudinary URL, public ID, or local file path
 */
// #endregion
export const deleteImageFile = async (imageUrlOrId: string): Promise<void> => {
  try {
    // Check if it's a Cloudinary URL
    if (imageUrlOrId.includes("cloudinary.com")) {
      // Cloudinary URL - extract public_id and delete
      await deleteFromCloudinary(imageUrlOrId);
      return;
    }

    // Check if it's a URL (other cloud storage)
    if (imageUrlOrId.startsWith("http")) {
      // Other cloud storage URL - log but don't error
      console.log(
        "Non-Cloudinary URL detected, skipping deletion:",
        imageUrlOrId
      );
      return;
    }

    // Legacy local file - handle for backward compatibility
    // This allows migration period where old files might still exist
    const imagePath = path.join(__dirname, "..", "uploads", imageUrlOrId);

    return new Promise<void>((resolve, reject) => {
      fs.unlink(imagePath, (err) => {
        if (err) {
          // If the file doesn't exist (ENOENT), that's actually the desired state
          if (err.code === "ENOENT") {
            console.log(
              "Local image file does not exist (already deleted or never existed):",
              imagePath
            );
            resolve();
          } else {
            // For other errors, log and reject
            console.error("Error while deleting the local image file: ", err);
            reject(err);
          }
        } else {
          console.log("Successfully deleted the local image file.");
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw - allow operation to continue
    // Log for monitoring and alerting
  }
};
