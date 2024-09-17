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
  },
});

// Static method to get the last note created by a specific user
noteSchema.statics.getLastNoteForUser = async function (userId) {
  try {
    // Find the most recent note for the given user, sorted by noteDate in descending order.
    // The sort({ noteDate: -1 }) ensures that it retrieves the latest note. noteDate is in a format where sorting by date works (i.e., ISO date strings).
    // select('noteDate'): Select only the noteDate field
    const lastNote = await this.findOne({ userId })
      .sort({ noteDate: -1 })
      .select("noteDate");
    console.log("lastNote: ", lastNote);
    return lastNote ? lastNote.noteDate : null;
  } catch (error) {
    console.error("Error fetching last note:", error);

    // Re-throw the error to be handled by the calling function, to ensure that the controller can handle it properly.
    throw error;
  }
};

// Static method to count notes for a user
noteSchema.statics.getTotalNotesOfAUser = async function (userId) {
  try {
    const totalNotes = await this.countDocuments({ userId });
    return totalNotes;
  } catch (error) {
    console.error("Error counting notes:", error);
    throw error;
  }
};

const notes = mongoose.model("note", noteSchema);

module.exports = notes;
