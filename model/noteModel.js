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

// Static method to get the last note created by a specific user
noteSchema.statics.getLastNoteForUser = async function (userId) {
  try {
    // Find the most recent note for the given user, sorted by noteDate in descending order
    const lastNote = await this.findOne({ userId })
      .sort({ noteDate: -1 })
      .select('noteDate'); // Only select the noteDate field

    return lastNote ? lastNote.noteDate : null;
  } catch (error) {
    console.error("Error fetching last note:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

const notes = mongoose.model("note", noteSchema);

module.exports = notes;
