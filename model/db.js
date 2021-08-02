"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uriDb = process.env.URI_DB;
const db = mongoose_1.default.connect(uriDb, {
    useNewParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    poolSize: 10,
});
mongoose_1.default.connection.on("connected", () => {
    console.log("\x1b[32m", "Connection with MongoDB is opened");
});
mongoose_1.default.connection.on("error", (err) => {
    console.log("\x1b[31m", `Error mongoose connection ${err.message}`);
});
mongoose_1.default.connection.on("disconnected", () => {
    console.log(`Mongoose disconnected`);
});
process.on("SIGINT", async () => {
    mongoose_1.default.connection.close(() => {
        console.log("Connection to DB terminated");
        process.exit(1);
    });
});
exports.default = db;
