const fs = require("fs");
const path = require("path");

const notes = require("../model/noteModel");

exports.addNoteOfAUserController = async (req, res) => {
  console.log("Inside addNoteController.");
  // console.log('req: ', req)
  // res.status(200).json("addNoteController received the request.");

  // Look for payload coming from jwtMiddleware.js
  const userId = req.payload;
  console.log("userId from payload coming from jwtMiddleware.js: ", userId);

  const { noteTitle, noteContent, noteDate } = req.body;
  console.log(noteTitle, noteContent, noteDate);

  console.log("req.file: ", req.file);
  console.log("req.file.filename: ", req.file.filename);

  const noteImage = req.file.filename;
  console.log("noteImage: ", noteImage);

  // res.status(200).json("Request received.");
  try {
    // This line performs a query on the notes collection in MongoDB.
    //findOne is a method provided by Mongoose (or MongoDB's native driver) that searches for a single document in the collection that matches the query criteria.
    // This is shorthand syntax for { noteTitle: noteTitle }, meaning that it is looking for a document where the noteTitle field in the document matches the value of the noteTitle variable.
    // await is used to pause the execution of the function until the findOne method resolves. This ensures that existingNote contains the result of the query before proceeding.
    const existingNote = await notes.findOne({ noteTitle });

    if (existingNote) {
      res.status(406).json("Note already exists.");
    } else {
      const newNote = new notes({
        noteTitle,
        noteContent,
        noteDate, // model_variable_name == frontend_variable_name
        noteImage, // noteImage: noteimage, if model_variable_name: frontend_variable_name
        userId,
      });
      await newNote.save();
      res.status(200).json(newNote);
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

// get all notes of all users
// This controller function fetches all notes from the MongoDB database and returns them to the client. If there's an error, it sends an error response.
// This controller function will retrieve all notes from the notes collection in the MongoDB database. This means that it will fetch every note stored in that collection, regardless of which user created it.
exports.getAllNotesOfAllUsersController = async (req, res) => {
  try {
    // notes is a Mongoose model representing the notes collection in the MongoDB database.
    // .find() fetches all documents from the notes collection.
    // await is used to pause the execution of the function until the find method resolves.
    const allNotes = await notes.find();

    // res.status(200): Sets the HTTP status code of the response to 200 OK, indicating that the request was successful.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // .json(allNotes): Sends the allNotes data as a JSON response to the client.
    res.status(200).json(allNotes);
  } catch (error) {
    // res.status(500): Sets the HTTP status code of the response to 500 Internal Server Error for unexpected issues.
    // 500 Status Code: This status code stands for "Internal Server Error," indicating that an error occurred on the server side that prevented it from fulfilling the request.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // message: A human-readable message describing the nature of the error. It provides context to the client about what went wrong.
    // error: The actual error object caught in the catch block. This typically contains more detailed information about the error, which can be useful for debugging.
    res
      .status(500)
      .json({ message: "An error occurred while fetching all notes", error });
  }
};

// get all notes of a user
exports.getAllNotesOfAUserController = async (req, res) => {
  const searchKey = req.query.search;
  console.log("searchKey: ", searchKey);
  const userId = req.payload;

  const query = {
    // Filter by a specific userId
    userId: userId,
    noteTitle: {
      $regex: searchKey,
      $options: "i",
    },
  };

  try {
    const allUserNote = await notes.find(query);
    res.status(200).json(allUserNote);

    // userId is the identifier for the user whose notes you want to retrieve.
    //
    // const userId = req.payload;

    // notes is a Mongoose model representing the notes collection in the MongoDB database.
    // notes.find({ userId }): Filters the notes by userId to fetch only those notes that belong to the specified user.
    // res.status(200): Sets the HTTP status code of the response to 200 OK, indicating that the request was successful.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // .json(userNotes): Sends the userNotes data as a JSON response to the client.
    //
    // const userNotes = await notes.find({ userId });
    // res.status(200).json(userNotes);
  } catch (error) {
    // res.status(500): Sets the HTTP status code of the response to 500 Internal Server Error for unexpected issues.
    // 500 Status Code: This status code stands for "Internal Server Error," indicating that an error occurred on the server side that prevented it from fulfilling the request.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // message: A human-readable message describing the nature of the error. It provides context to the client about what went wrong.
    // error: The actual error object caught in the catch block. This typically contains more detailed information about the error, which can be useful for debugging.
    res.status(500).json({
      message: "An error occurred while fetching the user's notes",
      error,
    });
  }
};

// get a note of a user
exports.getANoteOfAUserController = async (req, res) => {
  console.log("Inside getANoteOfAUserController()");
  const { id } = req.params;
  try {
    const aUserNote = await notes.find({ _id: id });
    res.status(200).json(aUserNote);

    // userId is the identifier for the user whose notes you want to retrieve.
    //
    // const userId = req.payload;

    // notes is a Mongoose model representing the notes collection in the MongoDB database.
    // notes.find({ userId }): Filters the notes by userId to fetch only those notes that belong to the specified user.
    // res.status(200): Sets the HTTP status code of the response to 200 OK, indicating that the request was successful.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // .json(userNotes): Sends the userNotes data as a JSON response to the client.
    //
    // const userNotes = await notes.find({ userId });
    // res.status(200).json(userNotes);
  } catch (error) {
    // res.status(500): Sets the HTTP status code of the response to 500 Internal Server Error for unexpected issues.
    // 500 Status Code: This status code stands for "Internal Server Error," indicating that an error occurred on the server side that prevented it from fulfilling the request.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // message: A human-readable message describing the nature of the error. It provides context to the client about what went wrong.
    // error: The actual error object caught in the catch block. This typically contains more detailed information about the error, which can be useful for debugging.
    res.status(500).json({
      message: "An error occurred while fetching the user's note.",
      error,
    });
  }
};

//edit note of a user
// To update an existing note in the MongoDB database with new information provided in the request.
// This exports the editNoteOfAUserController function so it can be used as a route handler in the Express application.
// async (req, res): Defines an asynchronous function that handles the request (req) and response (res) objects. Asynchronous functions are used to handle operations that involve promises, such as database queries.
exports.editNoteOfAUserController = async (req, res) => {
  // req.params: Contains route parameters (e.g., /notes/:id).
  // id: Extracts the note ID from the request parameters, which is used to find and update the specific note.
  const { id } = req.params;

  // req.payload: This is obtained from jwtmiddleware.js. This identifies the user associated with the note.
  const userId = req.payload;

  // req.body: Contains data sent in the request body, typically when updating a note.
  // Extracts noteTitle, noteContent, noteDate, and noteImage from the body. These are the fields to update in the note.
  const { noteTitle, noteContent, noteDate, noteImage } = req.body;

  // req.file: If an image file is uploaded, it will be available in req.file.
  // req.file.filename: The name of the uploaded image file.
  // noteImage: If no new file is uploaded, it uses the existing noteImage value from the request body.
  // uploadNoteImage: Determines which image filename to use — either the newly uploaded image or the existing one.
  const uploadNoteImage = req.file ? req.file.filename : noteImage;

  // Starts a try-catch block to handle any potential errors that may occur during the database operation.
  try {
    // Updating the note.
    // notes.findByIdAndUpdate(...): Mongoose method that finds a document by its ID and updates it with the provided data.
    // { _id: id }: Query to find the note by its _id (which is the ID extracted from the request parameters).
    // { noteTitle, noteContent, noteDate, noteImage: uploadNoteImage, userId }: New data to update the note with.
    // { new: true }: Option to return the updated document instead of the original one.
    const updateNote = await notes.findByIdAndUpdate(
      { _id: id },
      {
        noteTitle,
        noteContent,
        noteDate,
        noteImage: uploadNoteImage,
        userId,
      },
      { new: true }
    );

    // updateNote.save(): This line saves the updated note document.
    // await is used to pause the execution of the function until the updateNote.save() resolves.
    await updateNote.save();

    // res.status(200): Sets the HTTP status code to 200 OK, indicating the update was successful.
    // .json(updateNote): Sends the updated note as a JSON response to the client.
    res.status(200).json(updateNote);

    // catch (error): Catches any errors that occur during the try block execution.
  } catch (error) {
    // res.status(500).json(error);: Sets the HTTP status code to 500 Internal Server Error and sends the error details in the response. This informs the client that something went wrong on the server.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // message: A human-readable message describing the nature of the error. It provides context to the client about what went wrong.
    // error: The actual error object caught in the catch block. This typically contains more detailed information about the error, which can be useful for debugging.
    res.status(500).json({
      message: "An error occurred while updating the user's edited note :",
      error,
    });
  }
};

//delete note of a user
// exports.deleteNoteOfAUserController: This exports the deleteNoteOfAUserController function so it can be used as a route handler in the Express application.
// async (req, res): Defines an asynchronous function that handles the incoming request (req) and sends a response (res). Asynchronous functions are used to handle operations that involve promises, such as database queries.
exports.deleteNoteOfAUserController = async (req, res) => {
  // req.params: Contains route parameters (e.g., /notes/:id).
  // const { id } = req.params;: Extracts the id parameter from the request. This ID represents the note to be deleted.
  const { id } = req.params;
  try {
    const deleteNote = await notes.findById(id);

    if (!deleteNote) {
      return res.status(404).json({ message: "Note not found." });
    }

    const imagePath = path.join(
      __dirname,
      "..",
      "uploads",
      deleteNote.noteImage
    );

    // Delete the image from the uploads folder
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error while deleting the image file: ", err);
      } else {
        console.log("Successfully deleted the image file.");
      }
    });

    // Delete the note from the database.
    // notes.findByIdAndDelete(...): Mongoose method that finds a document by its ID and deletes it.
    // { _id: id }: The query to find the note by its _id (which is the ID extracted from the request parameters).
    // await is used to pause the execution until the findByIdAndDelete operation is complete, allowing the code to wait for the promise to resolve and get the result.
    await notes.findByIdAndDelete({ _id: id });

    // res.status(200): Sets the HTTP status code to 200 OK, indicating that the request was successful.
    // .json(deleteNote): Sends the deleted note as a JSON response to the client. This allows the client to see which note was deleted.
    res
      .status(200)
      .json({ message: "Note and image were deleted successfully. Deleted note: ", deleteNote });
  } catch (err) {
    // res.status(500).json(error);: Sets the HTTP status code to 500 Internal Server Error and sends the error details in the response. This informs the client that something went wrong on the server.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // message: A human-readable message describing the nature of the error. It provides context to the client about what went wrong.
    // error: The actual error object caught in the catch block. This typically contains more detailed information about the error, which can be useful for debugging.
    res.status(500).json({
      message: "An error occurred while deleting the user's note and image:",
      error: err,
    });
  }
};

/* // (req, res): These are the request and response objects provided by Express. req contains the incoming request data, and res is used to send a response back to the client.
// req: The request object containing details of the incoming request, including any data sent with it (such as the uploaded file).
// res: The response object used to send back a response to the client.
exports.uploadDefaultImageForNoteOfAUserController = async (req, res) => {

  // This block is used for error handling. The try block contains the code that might throw an error, and if an error occurs, the catch block will execute.
  // This ensures that even if something goes wrong, the server can handle the situation gracefully and return a meaningful error message.
  try {

    // This line sends a JSON response back to the client.
    // req.file.filename: multer stores the uploaded file on the server, and filename is the name of the file on the server. By default, multer generates a unique filename to prevent collisions.
    // filePath: `/uploads/${req.file.filename}: This constructs the file path where the uploaded image is stored on the server. This path is relative to the public directory from which the file can be served.
    // The client receives this filePath in the response, which it can then use to display the image or store the path in a database.
    res.json({ filePath: `/uploads/${req.file.filename}` });

    // If any error occurs during the file upload process (e.g., if the file can't be saved or the server has issues), the catch block is executed.
  } catch (error) {

    // res.status(500): This sets the HTTP status code to 500, indicating an internal server error.
    // json({ message: "File upload failed", error }): This sends a JSON response back to the client with an error message and the error object, providing details about what went wrong.
    res.status(500).json({ message: "File upload failed.", error });
  }
} */
