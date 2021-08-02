"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisClient = redis_1.default.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
    no_ready_check: true,
    auth_pass: process.env.REDIS_PASSWORD,
});
redisClient.on("connect", () => {
    console.log("\x1b[32m", "redis client is connected!");
});
redisClient.on("error", (err) => {
    console.log("\x1b[31m", `Error redis connection ${err.message}`);
});
redisClient.on("disconnected", () => {
    console.log(`redis has been disconnected`);
});
exports.default = redisClient;
