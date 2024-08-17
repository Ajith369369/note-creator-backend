// Router-Specific Middleware is used in this project.
const jwt = require("jsonwebtoken");
const jwtMiddleware = (req, res, next) => {
  console.log("Inside jwt Middleware.");
  console.log('req.headers: ', req.headers)

  // Token from request header
  // in req.headers, it is "authorization" instead of "Authorization"
  const token = req.headers["authorization"].split(" ")[1];
  console.log("token: ", token);
  // next()

  // Verify token
  try {
    const jwtResponse = jwt.verify(token, "ultimatesupersecretkey");
    console.log('jwtResponse: ', jwtResponse)
    
    req.payload = jwtResponse.userId;
    console.log('jwtResponse.userId: ', jwtResponse.userId)

    // Time at which token is generated
    console.log('jwtResponse.iat (Time at which token is generated): ', jwtResponse.iat)

    // res.status(200).json("Authorization successful.");
    next();
  } catch (error) {
    res.status(401).json( `Authorization failed: ${error}`)
  }
};

module.exports = jwtMiddleware;
