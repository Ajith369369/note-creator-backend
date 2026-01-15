// import dotenv FIRST before any other imports that might use environment variables
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
// ES modules don't have __dirname, so we need to create it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Configure dotenv with explicit path to .env file
dotenv.config({ path: join(__dirname, ".env") });
// import express
import express from "express";
// import cors
import cors from "cors";
// import router
import router from "./routes/router.js";
// import MongoDB connection file
import "./database/connection.js";
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
// set port for the server to run
const PORT = process.env.PORT || "3500";
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
//# sourceMappingURL=index.js.map