// import mongoose
const mongoose = require("mongoose");

// import noteModel
const notes = require("../model/noteModel");

// import deleteImageFile
const { deleteImageFile } = require("../utils/fileUtils");

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
    return allUsers;
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
  console.log("Inside deleteUserAndNotes().");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Inside "try".');
    /**
     * Try to find and delete the user by ID within the session.
     * If the user doesn't exist, abort the transaction and return null.
     * The .session(session) ensures that this operation is part of the ongoing transaction, so it can be committed or rolled back as needed.
     */
    const user = await users.findByIdAndDelete(userId).session(session);
    console.log("user: ", user);
    if (!user) {
      await session.abortTransaction();
      console.log("User not found, transaction aborted.");
      return null;
    }
    console.log("After !user check, fetching all note IDs of the user.");

    // #region Multi-line Comment
    /**
     * Fetch all note IDs of the user from the 'notes' collection.
     * 
     * Query: const allNoteIdsOfNotesOfAUser = await notes.find({}, "_id").lean().session(session);
     * This query retrieves only the _id fields of all the notes in the collection.
     * notes.find({}, "_id"): This finds all notes in the collection (no specific userId filter is applied, meaning it will retrieve notes for all users), and only the _id field of each document is returned. The second argument ("_id") is called the projection, which limits the fields returned in the result. In this case, only the _id field is returned, not the entire note.
     * This returns an array of objects where each object only contains the _id field of each note, but it fetches notes of all users, not just a specific one.
     * 
     * Query: const allNotesOfUser = await Note.find({ userId }).lean().session(session);
     * This query is used to find all notes created by a specific user based on the userId.
     * Note.find({ userId }): Finds all notes in the notes collection where the userId matches the provided value. This retrieves the entire note objects that match the query.
     * 
     * Query: const allNoteIdsOfNotesOfAUser = await notes.find({ userId }, "_id").lean().session(session);
     * notes.find({ userId }, "_id"): The find method is querying the notes collection for documents where the userId field matches the provided userId. It fetches all the notes created by this specific user.
     * "_id": This is the projection, which means that only the _id field of each document is returned, rather than the entire note object (which typically includes noteTitle, noteContent, noteDate, etc.). The result is a list of objects containing only the _id field of each note.
     * 
     * .lean(): Returns plain JavaScript objects instead of Mongoose documents, which makes querying more efficient. It also removes Mongoose's built-in methods like .save() and .validate().
     * .session(session): Associates this query with a MongoDB transaction session to ensure that all database operations within this session are part of the same transaction (used in multi-step operations).
     */
    // #endregion
    const allNoteIdsOfNotesOfAUser = await notes
      .find({userId}, "_id")
      .lean()
      .session(session);
    console.log("allNoteIdsOfNotesOfAUser: ", allNoteIdsOfNotesOfAUser);

    // #region Multi-line Comment
    /**
     * Delete all associated notes and their images.
     */
    // #endregion
    await Promise.all(
      allNoteIdsOfNotesOfAUser.map(async (noteId) => {
        const deleteNote = await notes.findById(noteId).session(session);

        if (!deleteNote) {
          console.error("Note not found.");
          throw new Error("Note not found.");
        } else {
          console.log("Deleting note image: ", deleteNote.noteImage);
          // #region Multi-line Comment
          /**
           * No need to pass the session to deleteImageFile() (since it's not interacting with DB).
           * Ensure deleteImageFile() is called without .session(session) since it does not interact with the database.
           * No session needed for file system.
           */
          // #endregion
          await deleteImageFile(deleteNote.noteImage)
        }
      })
    );

    // #region Multi-line Comment
    /**
     * Delete all notes associated with the user (notes having the same userId) within the same session.
     * The .session(session) ensures that this operation is part of the ongoing transaction, so it can be committed or rolled back as needed.
     * If both operations (i.e., deleting the user and their notes) succeed, commit the transaction.
     * If everything is successful, true is returned to indicate that the user and their notes were deleted.
     */
    // #endregion
    await notes.deleteMany({ userId }).session(session);

    console.log("Notes deleted, committing transaction.");
    await session.commitTransaction();
    return true;
  } catch (error) {
    // #region Multi-line Comment
    /**
     * If an error occurs at any point, rollback the transaction. If an error occurs, the transaction is aborted, which means any changes made in the session (user or note deletions) are rolled back.
     * Rethrow the error to handle it outside. After aborting the transaction, the error is re-thrown so it can be handled by whatever function called this static method.
     */
    // #endregion
    console.error("Error occurred, aborting transaction:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    // #region Multi-line Comment
    /**
     * The finally block runs after the try or catch block, regardless of whether the operation succeeded or failed.
     *
     * Whether successful or failed, always end the session to release resources.
     *
     * This ends the MongoDB session, releasing resources. This is necessary to avoid memory leaks or keeping a session open longer than needed.
     */
    // #endregion
    session.endSession();
    console.log("Session ended.");
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
