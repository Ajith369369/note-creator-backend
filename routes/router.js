//  This file defines routes for handling user registration, login, and note addition in a RESTful API.
// The code sets up a series of API endpoints for user registration, login, and note management.
// Middleware like JWT authentication and file upload handling (via Multer) is applied to certain routes to add security and functionality.

// import express
// This is the primary framework used to create the web server. It simplifies the process of handling HTTP requests and responses.
// Express is used to create a router and define routes that are linked to specific controller functions.
const express = require("express");

// import userController
// This module contains the logic for handling user-related operations. This is imported from the controllers directory.
const userController = require("../controllers/userController");

// import noteController
// This module contains the logic for handling note-related operations. This is imported from the controllers directory.
const noteController = require("../controllers/noteController");

// jwt middleware
// This is middleware used for handling JSON Web Token (JWT) authentication. It ensures that only authenticated users can access certain routes.
const jwt = require("../middleware/jwtMiddleware");

// multer middleware
// This is middleware used for handling file uploads. It's configured to handle a single file upload for a note image, identified by the form field name "noteImage".
const multer = require("../middleware/multerMiddleware");

// create object for router class
// router: This creates a new instance of the Express Router. The router allows you to define routes that can be modularized and used in different parts of the application.
const router = new express.Router();

// register
// Creates Register route
// Path: /register
// Method: POST
// Handler: userController.registerController
// Handles user registration. When a POST request is made to /register, the registerController function in userController is executed.
router.post("/register", userController.registerController);

// login
// Creates Login route
// Path: /login
// Method: POST
// Handler: userController.loginController
// Handles user login. When a POST request is made to /login, the loginController function in userController is executed.
router.post("/login", userController.loginController);

// add note of a user
// Creates Add Note route
// Path: /notes/user/add
// Method: POST
// Middlewares:
// jwt: Ensures the request is authenticated via a JWT.
// multer.single("noteImage"): Handles the file upload for a single image file, which should be passed with the form field name "noteImage".
// Allows authenticated users to add a note. The addNoteController function in noteController is executed, processing the uploaded note image along with other note details.
// router.post("/add-note", jwt, noteController.addNoteController);
router.post(
  "/notes/user/add",
  jwt,
  multer.single("noteImage"),
  noteController.addNoteOfAUserController
);

// get all notes of all users
// router.get("/notes/all", noteController.getAllNotesOfAllUsersController);

// get all notes of a user
// router.get("/notes/user/all", jwt, noteController.getAllNotesOfAUserController);
router.get("/notes/user/all", jwt, noteController.getAllNotesOfAUserController);

// get a note of a user
router.get("/notes/user/:id", noteController.getANoteOfAUserController);

// edit note of a user
router.put(
  "/notes/user/edit/:id",
  jwt,
  multer.single("noteImage"),
  noteController.editNoteOfAUserController
);

// delete note of a user
router.delete(
  "/notes/user/delete/:id",
  jwt,
  noteController.deleteNoteOfAUserController
);

// upload default image
// This backend route handles file uploads from the client. It uses multer to process and save the uploaded file on the server, then responds with the file's path if successful. If an error occurs, it catches the error and sends a response indicating that the upload failed. This setup allows the frontend to upload images or files to the server, receive the path of the uploaded file, and use it as needed
// 'noteImage': This is the name of the form field (key) that contains the file being uploaded. It must match the name used in formData.append("noteImage", file) on the frontend.
// This middleware extracts the uploaded file from the request, processes it (e.g., stores it in a designated folder), and makes it accessible via req.file.
// router.post('/upload', jwt, multer.single("noteImage"), noteController.uploadDefaultImageForNoteOfAUserController)

// get data for admin dashboard
router.get("/profile-home/admin", jwt, userController.adminDataController);

// #region Multi-line Comment
/**
 * delete user and all his notes.
 */
// #endregion
router.delete(
  "/profile-home/admin/user/delete/:id",
  jwt,
  userController.deleteUserController
);

// #region Multi-line Comment
/**
 * export module to backend
 * Exporting the router
 * 
 * This line exports the router object, making it available to be imported and used in the main application (index.js file). This allows the routes defined in this file to be integrated into the larger Express application.
 * 
 * The router is exported so it can be used in the main server file (index.js file), allowing these routes to be part of the API.
 */
// #endregion
module.exports = router;
