import { Request, Response } from "express";
export declare const addNoteOfAUserController: (req: Request, res: Response) => Promise<void>;
export declare const getAllNotesOfAllUsersController: (_req: Request, res: Response) => Promise<void>;
export declare const getAllNotesOfAUserController: (req: Request, res: Response) => Promise<void>;
export declare const getANoteOfAUserController: (req: Request, res: Response) => Promise<void>;
/**
 * Edit note of a user.
 * To update an existing note in the MongoDB database with new information provided in the request.
 * This exports the editNoteOfAUserController function so it can be used as a route handler in the Express application.
 * async (req, res): Defines an asynchronous function that handles the request (req) and response (res) objects. Asynchronous functions are used to handle operations that involve promises, such as database queries.
 */
export declare const editNoteOfAUserController: (req: Request, res: Response) => Promise<void>;
/**
 * Delete note of a user.
 * This function ensures that both the note and its associated image are deleted.
 * exports.deleteNoteOfAUserController: This exports the deleteNoteOfAUserController function so it can be used as a route handler in the Express application.
 * async (req, res): Defines an asynchronous function that handles the incoming request (req) and sends a response (res). Asynchronous functions are used to handle operations that involve promises, such as database queries.
 */
export declare const deleteNoteOfAUserController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=noteController.d.ts.map