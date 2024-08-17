// import mongoose
const mongoose = require('mongoose');

const connectionString = process.env.DATABASE;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.log(`Connection failed due to, ${err}`);
  });

  // catch() is a function where rejected response is received.