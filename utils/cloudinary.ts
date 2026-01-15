import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "..", ".env") });

// Enterprise-grade Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
});

// Validate configuration on startup
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn(
    "⚠️  Cloudinary credentials not found. Image uploads will fail."
  );
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID or full URL
 * @returns Promise with deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    // Extract public_id from URL if full URL is provided
    let imagePublicId = publicId;

    // If it's a Cloudinary URL, extract the public_id
    if (publicId.includes("cloudinary.com")) {
      const urlParts = publicId.split("/");
      const filename = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      imagePublicId = folder
        ? `${folder}/${filename.split(".")[0]}`
        : filename.split(".")[0];
    }

    const result = await cloudinary.uploader.destroy(imagePublicId, {
      resource_type: "image",
    });

    if (result.result === "ok") {
      console.log(
        `Successfully deleted image from Cloudinary: ${imagePublicId}`
      );
    } else if (result.result === "not found") {
      console.log(`Image not found in Cloudinary: ${imagePublicId}`);
      // Don't throw error - idempotent operation
    } else {
      throw new Error(`Failed to delete image: ${result.result}`);
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    // Don't throw - allow operation to continue even if deletion fails
    // Log for monitoring instead
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID or null
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    if (!url.includes("cloudinary.com")) {
      return null;
    }

    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) {
      return null;
    }

    // Get the path after /upload/v{version}/
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
    // Remove file extension
    return pathAfterUpload.split(".")[0];
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
};

export default cloudinary;
