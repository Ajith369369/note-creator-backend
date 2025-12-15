// Router-Specific Middleware is used in this project.
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  iat?: number;
}

const jwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("Inside jwt Middleware.");
  // console.log("req.headers: ", req.headers);

  // Token from request header
  // in req.headers, it is "authorization" instead of "Authorization"
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    res.status(401).json("Authorization header missing");
    return;
  }

  const token = authHeader.split(" ")[1];
  console.log("token: ", token);
  // next()

  // Verify token
  try {
    const jwtResponse = jwt.verify(
      token,
      "ultimatesupersecretkey"
    ) as JwtPayload;
    console.log("jwtResponse: ", jwtResponse);

    req.payload = jwtResponse.userId;
    console.log("jwtResponse.userId: ", jwtResponse.userId);

    // Time at which token is generated
    console.log(
      "jwtResponse.iat (Time at which token is generated): ",
      jwtResponse.iat
    );

    // res.status(200).json("Authorization successful.");
    next();
  } catch (error) {
    res.status(401).json(`Authorization failed: ${error}`);
  }
};

export default jwtMiddleware;

