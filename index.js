// import dotenv
require("dotenv").config(); // loads env variable

// import express
const express = require("express");

// import cors
const cors = require("cors");

// import router
const router = require("./routes/router");

// import MongoDB connection file
require("./database/connection");

// Not used in this project
// Application-specific Middleware
// const appmiddleware = require("./middleware/appMiddleware");

// create server
const noteCreatorServer = express();

// connect server with frontend
noteCreatorServer.use(cors());

// parse json format of data received at the server side - json()
noteCreatorServer.use(express.json());

// Not used in this project
// Application-specific Middleware
// noteCreatorServer.use(appmiddleware);

// router
noteCreatorServer.use(router);

// static() is used to export a file/folder from the server-side.
// 1st argument ('/uploads') - The name by which other application (frontend) should use the exported file/folder.
// 2nd argument ('./uploads') - The path of the file/folder which needs to be exported.
// The file could be seen in: "http://localhost:4000/uploads/image-1723704799894-Media Player.png"
noteCreatorServer.use('/uploads', express.static('./uploads'))

// set port for the server to run
const PORT = 3500 || process.env.PORT;

noteCreatorServer.listen(PORT, () => {
  console.log(`Server running successfully at PORT NUMBER: ${PORT}`);
});

// use nodemon index.js because servers don't have auto-compilation.

// logic
/* noteCreatorServer.get("/get", (req, res) => {
  res.send("GET request received.");
});

noteCreatorServer.post("/post", (req, res) => {
  res.send("POST request received.");
});

noteCreatorServer.put("/put", (req, res) => {
  res.send("PUT request received.");
});

noteCreatorServer.delete("/delete", (req, res) => {
  res.send("DELETE request received.");
});
 */
