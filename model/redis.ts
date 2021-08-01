import redis from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
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

export default redisClient;
