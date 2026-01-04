// import mongoose
import dotenv from "dotenv";
import mongoose from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Configure dotenv if not already configured (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

const connectionString = process.env.DATABASE;

if (!connectionString) {
  console.error(
    "Error: DATABASE environment variable is not set. Please check your .env file."
  );
  process.exit(1);
}

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.log(`Connection failed due to, ${err}`);
  });

// catch() is a function where rejected response is received.
