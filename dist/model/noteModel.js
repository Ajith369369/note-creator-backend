"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// import mongoose
const mongoose_1 = __importStar(require("mongoose"));
const noteSchema = new mongoose_1.Schema({
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error("Error counting notes:", error);
        throw error;
    }
};
const notes = mongoose_1.default.model("note", noteSchema);
exports.default = notes;
//# sourceMappingURL=noteModel.js.map