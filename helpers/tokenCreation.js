const redisClient = require("../model/redis");
const jwt = require("jsonwebtoken");

const GET_ACCESS_TOKEN = function async(req, res) {
  const { id } = req.user;
  const payload = { id };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TIME,
  });
  const refreshToken = GENERATE_REFRESH_TOKEN(id);
  return res.json({ status: true, message: "success", data: { accessToken, refreshToken } });
};

const GENERATE_REFRESH_TOKEN = function async(id) {
  const payload = { id };
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TIME,
  });

  redisClient.get(id.toString(), (err, data) => {
    if (err) throw err;

    redisClient.set(id.toString(), JSON.stringify({ refreshToken }));
  });

  return refreshToken;
};

module.exports = { GET_ACCESS_TOKEN, GENERATE_REFRESH_TOKEN };
