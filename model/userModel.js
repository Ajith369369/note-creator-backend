// import mongoose
const mongoose = require("mongoose");
 
// import noteModel
const notes = require("../model/noteModel");

const userSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  profile: {
    type: String,
  },
});

// Static method to get all users with specific fields (userId, username, email)
// This defines a static method on the Mongoose schema. Static methods can be called directly on the model, rather than on individual instances of the model.
userSchema.statics.getIdUsernameEmailOfAllUsers = async function (userId) {
  try {
    // Query to find all users with only _id (userId), username, and email.
    // find(): This is a Mongoose method that retrieves data from MongoDB based on the query parameters.
    // find({}): The empty object {} as the first argument means we are not specifying any filters — we want to retrieve all documents from the users collection.
    // "_id username email": The second argument is the projection, which specifies the fields we want to include in the result (_id, username, and email). Other fields in the document will be excluded.
    // The Mongoose way to specify a projection is using `.select()`
    // .lean() returns plain JS objects. This converts the Mongoose documents into plain JavaScript objects, without attaching Mongoose-specific functions (like .save() or .validate()).
    // await: This makes sure the code waits until the database query is complete before continuing. The function is asynchronous, meaning it doesn't block the rest of the program, but this specific line will wait for the query to resolve.
    const allUsers = await this.find({}, "_id username email").lean(); 
    return allUsers
  } catch (error) {
    console.error("Error fetching id, username, and email of users:", error);

    // Re-throw the error to be handled by the calling function, to ensure that the controller can handle it properly.
    // This rethrows the error after logging it, allowing the calling code to handle the error appropriately (e.g., showing an error message to the user or retrying the operation).
    // Ensures that errors don't silently fail, allowing them to propagate to where the function is called, so the calling code can handle them properly.
    throw error;
  }
};

/**
 * Business logic is isolated; model handles the data access logic.
 *  Static methods are called directly on the model (User) rather than on instances of the model.
 * userId is passed as a parameter to identify which user to delete.
 * Transactions: This code uses MongoDB transactions, which ensure that both the deletion of the user and their notes either both succeed or both fail. This ensures data integrity.
 * Error Handling: If anything goes wrong, the transaction is rolled back, and an error is thrown to be handled by the calling function.
 * Session: All database operations are performed within the context of a session. This ensures that the operations can be committed or rolled back as a unit.
 */
userSchema.statics.deleteUserAndNotes = async (userId) => {
  /**
   * Start a new database transaction for the session (MongoDB session).
   * This ensures that any changes made during this session are grouped together. If one operation fails, the transaction can be rolled back to undo all changes.
   */
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    /**
     * Try to find and delete the user by ID within the session.
     * If the user doesn't exist, abort the transaction and return null.
     * The .session(session) ensures that this operation is part of the ongoing transaction, so it can be committed or rolled back as needed.
     */
    const user = await this.findByIdAndDelete(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return null;
    }
    // #region Multi-line Comment
    /**
     * Delete all notes associated with the user (notes having the same userId) within the same session.
     * The .session(session) ensures that this operation is part of the ongoing transaction, so it can be committed or rolled back as needed.
     * If both operations (i.e., deleting the user and their notes) succeed, commit the transaction.
     * If everything is successful, true is returned to indicate that the user and their notes were deleted.
     */
    // #endregion
    await notes.deleteMany({ userId }).session(session);
    await session.commitTransaction();
    return true;
  } catch (error) {
    // #region Multi-line Comment
    /**
     * If an error occurs at any point, rollback the transaction. If an error occurs, the transaction is aborted, which means any changes made in the session (user or note deletions) are rolled back.
     * Rethrow the error to handle it outside. After aborting the transaction, the error is re-thrown so it can be handled by whatever function called this static method.
     */
    // #endregion
    await session.abortTransaction();
    throw error;
  } 
  // #region Multi-line Comment
  /**
   * The finally block runs after the try or catch block, regardless of whether the operation succeeded or failed.
   */
  // #endregion
  finally {
    /**
     * Whether successful or failed, always end the session to release resources.
     * This ends the MongoDB session, releasing resources. This is necessary to avoid memory leaks or keeping a session open longer than needed.
     */
    session.endSession();
  }
};

// #region Multi-line Comment
/**
 * model("users", userSchema), "users" collection from MongoDB Atlas.
 * Creates a model based on the userSchema and links it to the users collection in MongoDB.
 */
// #endregion
const users = mongoose.model("users", userSchema);

// #region Multi-line Comment
/**
 * Makes this model available for import in other files, allowing you to perform database operations on the users collection.
 */
// #endregion
module.exports = users;
