import { Model, Document } from "mongoose";
export interface INote extends Document {
    noteTitle: string;
    noteContent: string;
    noteDate: string;
    noteImage?: string;
    userId: string;
}
export interface INoteModel extends Model<INote> {
    getLastNoteForUser(userId: string): Promise<string | null>;
    getTotalNotesOfAUser(userId: string): Promise<number>;
}
declare const notes: INoteModel;
export default notes;
//# sourceMappingURL=noteModel.d.ts.map