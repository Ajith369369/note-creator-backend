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

// Static method to get the last note created by a specific user
userSchema.statics.getIdUsernameEmailOfAllUsers = async function (userId) {
  try {
    // Query to find all users with only _id (userId), username, and email
    /* find(): This method is used to query the database. The empty object {} inside find() means we are querying for all documents in the users collection (no filter is applied).
    
    {}, { projection }:
      First Argument ({}): This is the filter argument. Since it is an empty object, it means no specific filter is applied and all documents will be returned.
      Second Argument ({ projection }): This specifies the fields that should be included or excluded in the result. In this case, projection is defined as { _id: 1, username: 1, email: 1 }, meaning:
        _id: 1: Include the _id field (also known as userId).
        username: 1: Include the username field.
        email: 1: Include the email field.
        
    So, only these three fields will be included in the result for each user document.
    
    toArray(): This converts the query result (which is a cursor) into an array of documents. In MongoDB, queries typically return a cursor, which allows for streaming large datasets. .toArray() gathers all the documents into an array, which is easier to work with.
    
    await: Since find() is asynchronous (it involves querying the database), we use await to ensure the program waits for the query to complete before proceeding.
    
    find(): Queries the database.
    projection: Selects which fields to return (_id, username, email).
    toArray(): Converts the result to an array.
    await: Ensures the query completes before continuing the execution.*/
    const projection = { _id: 1, username: 1, email: 1 };
    const allUsers = await this.find({}, { projection }).toArray();
    return allUsers
  } catch (error) {
    console.error("Error fetching id, username, and email of users:", error);

    // Re-throw the error to be handled by the calling function, to ensure that the controller can handle it properly.
    throw error;
  }
};

// model("users", userSchema), "users" collection from MongoDB Atlas
// Creates a model based on the userSchema and links it to the users collection in MongoDB.
const users = mongoose.model("users", userSchema);

// Makes this model available for import in other files, allowing you to perform database operations on the users collection.
module.exports = users;
