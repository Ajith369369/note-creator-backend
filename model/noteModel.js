// import mongoose
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  noteTitle: {
    required: true,
    type: String,
  },
  noteContent: {
    required: true,
    type: String,
  },
  noteDate: {
    required: true,
    type: String,
  },
  noteImage: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  }
});

const notes = mongoose.model("note", noteSchema);

module.exports = notes;
