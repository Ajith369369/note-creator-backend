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

// model("users", userSchema), "users" collection from MongoDB Atlas
// Creates a model based on the userSchema and links it to the users collection in MongoDB.
const users = mongoose.model("users", userSchema);

// Makes this model available for import in other files, allowing you to perform database operations on the users collection.
module.exports = users;
