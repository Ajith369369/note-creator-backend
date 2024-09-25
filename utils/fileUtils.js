// #region Multi-line Comment
/**
 * fs: The file system module from Node.js is used to interact with the file system. It allows you to read, write, delete, and manipulate files.
 */
// #endregion
const fs = require("fs");

// #region Multi-line Comment
/**
 * path: This module provides utilities for working with file and directory paths. It's helpful for constructing file paths that work across different operating systems.
 */
// #endregion
const path = require("path");

// #region Multi-line Comment
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
// #endregion

// #region Multi-line Comment
/**
 * Function to delete the image file based on the noteImage.
 * 
 * The deleteImageFile function is designed to delete an image file from the filesystem asynchronously, leveraging promises to handle success and error states. This design allows the function to be easily integrated into an async/await flow, improving the readability and maintainability of the code.
 * 
 * This line declares an asynchronous function named deleteImageFile. It takes a single parameter, noteImage, which is the filename of the image you want to delete.
 */
// #endregion
const deleteImageFile = async (noteImage) => {

  // #region Multi-line Comment
  /**
   * Constructing the image file path. This line constructs the full path to the image file that needs to be deleted.
   * 
   * path.join(): This constructs the full path to the image file associated with the note. It is a method from the path module that safely concatenates paths, ensuring that the correct path separators are used for the operating system.
   * 
   * __dirname: It is a Node.js global variable that returns the directory name of the current module (i.e., the directory where the current file is located). Refers to the current directory (where this code resides).
   * 
   * '..': Moves up one level in the directory structure (to the parent folder).
   * 
   * 'uploads': Points to the "uploads" folder where the image files are stored.
   * 
   * note.noteImage: The image filename stored in the note document in the database. The noteImage field contains just the filename, not the full path.
   * 
   * This results in a path that points to the "uploads" directory, where the image files are stored.
   */
  // #endregion 
  const imagePath = path.join(__dirname, "..", "uploads", noteImage);

  // #region Multi-line Comment
  /**
   * Promise constructor.
   * Creating a Promise: This line creates a new Promise that will handle the asynchronous operation of deleting the file.
   * The promise takes two callback functions: resolve (to indicate success) and reject (to indicate failure).
   */
  // #endregion
  return new Promise((resolve, reject) => {

    // #region Multi-line Comment
    /**
     * Deleting the image from the file system (uploads folder)
     * 
     * fs.unlink(): Deletes the image file from the file system. It takes the imagePath as the first argument and a callback function as the second argument.
     * 
     * The callback function (err) => {} will be executed once the operation is complete, receiving an err argument if an error occurs.
     * err: If an error occurs during deletion (e.g., the file doesn't exist), it's handled inside the callback, where it logs the error to the console.
     */
    // #endregion
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error while deleting the image file: ", err);

        // #region Multi-line Comment
        /**
         *  Rejecting the Promise: This line calls reject(err), which indicates that the promise has failed. The error object is passed to the rejection handler, allowing the calling code to handle the error appropriately.
         *  reject(err): Reject the promise if an error occurs
         */
        // #endregion
        reject(err);
      } else {
        console.log("Successfully deleted the image file.");

        // #region Multi-line Comment
        /**
         * Resolving the Promise: This line calls resolve(), which indicates that the promise has been fulfilled successfully. This allows any code that was waiting for this promise to continue its execution.
         * Resolve the promise on successful deletion.
         */
        // #endregion
        resolve();
      }
    });
  });
};

// #region Multi-line Comment
/**
 * This code is used to export the deleteImageFile function from this module (file) so that it can be imported and used in other files.
 */
// #endregion
module.exports = {
  deleteImageFile
};