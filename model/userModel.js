// import mongoose
const mongoose = require("mongoose");

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

// model("users", userSchema), "users" collection from MongoDB Atlas
// Creates a model based on the userSchema and links it to the users collection in MongoDB.
const users = mongoose.model("users", userSchema);

// Makes this model available for import in other files, allowing you to perform database operations on the users collection.
module.exports = users;
