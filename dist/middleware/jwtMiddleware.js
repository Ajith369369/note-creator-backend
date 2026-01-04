"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtMiddleware = (req, res, next) => {
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
        const jwtResponse = jsonwebtoken_1.default.verify(token, "ultimatesupersecretkey");
        console.log("jwtResponse: ", jwtResponse);
        req.payload = jwtResponse.userId;
        console.log("jwtResponse.userId: ", jwtResponse.userId);
        // Time at which token is generated
        console.log("jwtResponse.iat (Time at which token is generated): ", jwtResponse.iat);
        // res.status(200).json("Authorization successful.");
        next();
    }
    catch (error) {
        res.status(401).json(`Authorization failed: ${error}`);
    }
};
exports.default = jwtMiddleware;
//# sourceMappingURL=jwtMiddleware.js.map