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
  try {
    // userId is the identifier for the user whose notes you want to retrieve.
    const userId = req.payload;

    // notes is a Mongoose model representing the notes collection in the MongoDB database.
    // notes.find({ userId }): Filters the notes by userId to fetch only those notes that belong to the specified user.
    // res.status(200): Sets the HTTP status code of the response to 200 OK, indicating that the request was successful.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // .json(userNotes): Sends the userNotes data as a JSON response to the client.
    const userNotes = await notes.find({ userId });
    res.status(200).json(userNotes);
  } catch (error) {
    // res.status(500): Sets the HTTP status code of the response to 500 Internal Server Error for unexpected issues.
    // 500 Status Code: This status code stands for "Internal Server Error," indicating that an error occurred on the server side that prevented it from fulfilling the request.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // message: A human-readable message describing the nature of the error. It provides context to the client about what went wrong.
    // error: The actual error object caught in the catch block. This typically contains more detailed information about the error, which can be useful for debugging.
    res
      .status(500)
      .json({ message: "An error occurred while fetching user notes", error });
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

    // notes.findByIdAndDelete(...): Mongoose method that finds a document by its ID and deletes it.
    // { _id: id }: The query to find the note by its _id (which is the ID extracted from the request parameters).
    // await is used to pause the execution until the findByIdAndDelete operation is complete, allowing the code to wait for the promise to resolve and get the result.
    const deleteNote = await notes.findByIdAndDelete({ _id: id });

    // res.status(200): Sets the HTTP status code to 200 OK, indicating that the request was successful.
    // .json(deleteNote): Sends the deleted note as a JSON response to the client. This allows the client to see which note was deleted.
    res.status(200).json(deleteNote);
  } catch (err) {

    // res.status(500).json(error);: Sets the HTTP status code to 500 Internal Server Error and sends the error details in the response. This informs the client that something went wrong on the server.
    // .json(): This method converts the provided JavaScript object into a JSON-formatted string and sends it as the body of the response.
    // message: A human-readable message describing the nature of the error. It provides context to the client about what went wrong.
    // error: The actual error object caught in the catch block. This typically contains more detailed information about the error, which can be useful for debugging.
    res.status(500).json({
      message: "An error occurred while deleting the user's note :",
      error,
    });
  }
};
