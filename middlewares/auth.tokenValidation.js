const jwt = require("jsonwebtoken");
const redisClient = require("../model/redis");
const { HTTP_CODES, HTTP_MESSAGES } = require("../helpers/constants");

const { UNAUTHORIZED } = HTTP_CODES;
const { BLACKLISTED_TOKEN, INVALID_REQUEST, INVALID_SESSION } = HTTP_MESSAGES;

const verifyRefreshToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    console.log(token, "token");

    if (token === null)
      return res.status(401).json({ status: UNAUTHORIZED, message: INVALID_REQUEST });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    console.log(decoded, "dec");

    req.userData = decoded;

    await redisClient.get("Blacklist_" + decoded.id, (err, data) => {
      if (err) throw err;

      if (data === token)
        return res.status(UNAUTHORIZED).json({ status: UNAUTHORIZED, message: BLACKLISTED_TOKEN });
      return next();
    });
  } catch (error) {
    return res
      .status(UNAUTHORIZED)
      .json({ status: UNAUTHORIZED, message: INVALID_SESSION, data: error });
  }
};

module.exports = verifyRefreshToken;
