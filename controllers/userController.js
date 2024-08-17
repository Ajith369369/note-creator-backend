const users = require("../model/userModel");
const jwt = require("jsonwebtoken");

// register
// POST
// http://localhost:4000/register
/* {
  "username": "max",
  "email":"max@gmail.com",
  "password":"max123"
} */

// This function handles user registration by checking if the email is already in use, and if not, it creates and saves a new user in the database.
// Proper status codes and messages are sent back to the client to indicate the outcome of the registration attempt.
// This is an asynchronous function being exported as registerController.
// It will handle the HTTP request and response cycle for user registration.
// This function will handle the registration process when a client makes a registration request.
exports.registerController = async (req, res) => {

  // Logs a message to the console to indicate that the registerController function has been invoked/called.
  console.log("Inside registerController");

  // Destructures the username, email, and password properties from the req.body object.
  // req.body contains the data sent by the client (e.g., via a registration form submission).
  const { username, email, password } = req.body;

  // Logs the username, email, and password values to the console.
  console.log(username, email, password);

  // res.status(200).json("Register request received.");

  // Starts a try block to handle potential errors that may occur during the execution of the code.
  try {

    // Uses the users model to search the database for a user with the matching email.
    // users is a Mongoose model representing the users collection in MongoDB.
    // Checks if a user with the given email already exists in the database. If the user is found, it will be stored in the existingUser variable.
    // await pauses the execution until the promise returned by users.findOne() is resolved.
    const existingUser = await users.findOne({ email }); 

    // email: email => email => email(model): email(console.log(username, email, password);)

    // If existingUser is not null (i.e., a user with the given email is found), this condition will be true.
    if (existingUser) {

      // If a user with the provided email already exists, the server responds with a 406 Not Acceptable status code and a JSON message "Account already exists!". This informs the client that the email is already in use.
      res.status(406).json("Account already exists!");

      // If no existing user is found with the given email, this block of code will execute.
    } else {

      // Creates a new instance of the users model.
      // The users model corresponds to the user schema in the MongoDB database.
      // The new user's details, including username, email, and password, are assigned.
      // The profile field is initialized as empty string.
      // This prepares the data to be saved to the database.
      const newUser = new users({
        username,
        email,
        password,
        profile: "",
      });

      // Saves the new user instance to the MongoDB database.
      // await pauses the execution until the user is successfully saved.
      await newUser.save();

      // After the user is successfully saved, the server responds with a 200 OK status code and the newly created user object as a JSON response. This confirms the successful registration of the user.
      res.status(200).json(newUser);
    }

    // If an error occurs at any point in the try block, this catch block will handle it.
  } catch (error) {

    // If an error is caught, the server responds with a 401 Unauthorized status code and the error message as a JSON response. This informs the client that something went wrong during the registration process.
    res.status(401).json(error);
  }
};

// login
// POST
// http://localhost:4000/login
/* {
  "email":"max@gmail.com",
  "password":"max123"
} */

// This is an asynchronous function being exported as loginController.
// It will handle the HTTP request and response cycle for user login.
// This function will handle the login process when a client makes a login request.
exports.loginController = async (req, res) => {

  // Logs a message to the console to indicate that the loginController function has been invoked/called.
  console.log('Inside login controller.');
  
  // Destructures email and password properties from the req.body object.
  // req.body contains the data sent by the client (e.g., via a login form submission).
  const { email, password } = req.body;

  // Logs the email and password values to the console.
  console.log(email, password);

  // Starts a try block to handle potential errors that may occur during the execution of the code.
  try {

    // Uses the users model to search the database for a user with the matching email and password.
    // users is a Mongoose model representing the users collection in MongoDB.
    // Checks if a user with the given email and password exists in the database. If the user is found, it will be stored in the existingUser variable.
    // await pauses the execution until the promise returned by users.findOne() is resolved.
    const existingUser = await users.findOne({ email, password });

    // Logs the existingUser object to the console, which contains the user data retrieved from the database.
    console.log(existingUser);

    // If existingUser is not null (i.e., a user with the given email and password was found), this condition will be true.
    if (existingUser) {

      // If a user is found, this line generates a JWT (JSON Web Token).
      // The token is created using the jwt.sign() method, which takes a payload (in this case, the user's ID) and a secret key ("supersecretkey").
      // The token will be used for authenticating future requests from the client.
      const token = jwt.sign({ userId: existingUser._id }, "ultimatesupersecretkey");

      // Logs the generated token to the console.
      console.log(token);

      // If the login is successful, the server responds with a 200 OK status code and sends back a JSON object containing the existingUser data and the token.
      // This allows the client to use the token for subsequent authenticated requests.
      res.status(200).json({ existingUser, token });
      console.log('existingUser: ', existingUser)
      console.log('token: ', token)

      // If no user is found with the given email and password, this block of code will execute.
    } else {

      // If the user is not found, the server responds with a 406 Not Acceptable status code and a message saying "Account does not exist".
      // This informs the client that the login credentials are incorrect or the account does not exist.
      res.status(406).json("Account does not exist");
    }

    // If an error occurs at any point in the try block, this catch block will handle it.
  } catch (error) {

    // If an error is caught, the server responds with a 401 Unauthorized status code and the error message as a JSON response. This informs the client that something went wrong during the login process.
    res.status(401).json(error);
  }
};
