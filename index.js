// import json server using require keyword, jsonServer library
const jsonServer = require("json-server");

// create json server using create method
const noteCreatorServer = jsonServer.create();

// create path for json file(data) - router()
const router = jsonServer.router("db.json");

// create middleware to parse json
const middleware = jsonServer.defaults();

// allow server to use router and middleware
noteCreatorServer.use(middleware);
noteCreatorServer.use(router);

// set up port for the server to run (default port)
PORT = 3000 || process.env.PORT;

// listen to the request
noteCreatorServer.listen(PORT, () => {
  console.log(`Server running successfully at port number, ${PORT}...`);
});
