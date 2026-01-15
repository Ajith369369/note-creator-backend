import { Document, Model } from "mongoose";
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profile?: string;
}
export interface IUserModel extends Model<IUser> {
    getIdUsernameEmailOfAllUsers(): Promise<Array<{
        _id: string;
        username: string;
        email: string;
    }>>;
    deleteUserAndNotes(userId: string): Promise<boolean | null>;
}
/**
 * model("users", userSchema), "users" collection from MongoDB Atlas.
 * Creates a model based on the userSchema and links it to the users collection in MongoDB.
 */
declare const users: IUserModel;
/**
 * Makes this model available for import in other files, allowing you to perform database operations on the users collection.
 */
export default users;
//# sourceMappingURL=userModel.d.ts.map