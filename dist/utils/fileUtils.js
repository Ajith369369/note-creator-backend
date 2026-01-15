/**
 * Image deletion utility for Cloudinary.
 * Deletes images from Cloudinary cloud storage.
 * @param imageUrl - Cloudinary URL or public ID
 */
import { deleteFromCloudinary } from "./cloudinary.js";
/**
 * Delete image from Cloudinary
 * @param imageUrl - Cloudinary URL or public ID
 */
export const deleteImageFile = async (imageUrl) => {
    try {
        // Check if it's a Cloudinary URL
        if (imageUrl.includes("cloudinary.com")) {
            await deleteFromCloudinary(imageUrl);
            return;
        }
        // Check if it's another HTTP URL (other cloud storage)
        if (imageUrl.startsWith("http")) {
            console.log("Non-Cloudinary URL detected, skipping deletion:", imageUrl);
            return;
        }
        // Invalid URL format - log warning
        console.warn("Invalid image URL format (expected Cloudinary URL):", imageUrl);
    }
    catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Don't throw - allow operation to continue
        // Log for monitoring and alerting
    }
};
//# sourceMappingURL=fileUtils.js.map