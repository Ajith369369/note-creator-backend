"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import mongoose
const mongoose_1 = __importDefault(require("mongoose"));
const connectionString = process.env.DATABASE;
mongoose_1.default
    .connect(connectionString)
    .then(() => {
    console.log("MongoDB connected successfully.");
})
    .catch((err) => {
    console.log(`Connection failed due to, ${err}`);
});
// catch() is a function where rejected response is received.
//# sourceMappingURL=connection.js.map