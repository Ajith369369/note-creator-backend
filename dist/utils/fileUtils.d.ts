/**
 * Creating utility functions, that can be used in any controller.
 * Functionalities that are needed in multiple controllers or places in the application.
 *
 * Code Reusability: We can reuse these functions across multiple controllers without duplicating code.
 *
 * Clean Controllers: Our controllers remain clean and focused on handling HTTP requests and responses.
 *
 * Easier Maintenance: If we need to change these functions' logic in the future, we only need to update it in one place.
 */
/**
 * Function to delete the image file based on the noteImage.
 *
 * The deleteImageFile function is designed to delete an image file from the filesystem asynchronously, leveraging promises to handle success and error states. This design allows the function to be easily integrated into an async/await flow, improving the readability and maintainability of the code.
 *
 * This line declares an asynchronous function named deleteImageFile. It takes a single parameter, noteImage, which is the filename of the image you want to delete.
 */
export declare const deleteImageFile: (noteImage: string) => Promise<void>;
//# sourceMappingURL=fileUtils.d.ts.map