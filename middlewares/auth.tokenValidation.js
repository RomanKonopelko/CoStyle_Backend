const jwt = require("jsonwebtoken");
const redisClient = require("../model/redis");
const { HTTP_CODES, HTTP_MESSAGES } = require("../helpers/constants");

const { CREATED, UNATHORIZED } = HTTP_CODES;
const { BLACKLISTED_TOKEN, INVALID_REQUEST, INVALID_SESSION } = HTTP_MESSAGES;

const verifyToken = async (req, res, next) => {
  try {
    // Bearer tokenstring
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userData = decoded;

    req.token = token;

    // varify blacklisted access token.
    redisClient.get("BL_" + decoded.sub.toString(), (err, data) => {
      if (err) throw err;

      if (data === token)
        return res.status(UNATHORIZED).json({ status: UNATHORIZED, message: BLACKLISTED_TOKEN });
      next();
    });
  } catch (error) {
    return res
      .status(UNATHORIZED)
      .json({ status: UNATHORIZED, message: INVALID_SESSION, data: error });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  const token = req.body.token;
  console.log(token);

  if (token === null)
    return res.status(401).json({ status: UNATHORIZED, message: INVALID_REQUEST });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userData = decoded;

    redisClient.get(decoded.sub.toString(), (err, data) => {
      if (err) throw err;

      if (data === null)
        return res.status(UNATHORIZED).json({ status: UNATHORIZED, message: INVALID_REQUEST });
      if (JSON.parse(data).token != token)
        return res.status(UNATHORIZED).json({ status: UNATHORIZED, message: INVALID_REQUEST });

      next();
    });
  } catch (error) {
    return res
      .status(UNATHORIZED)
      .json({ status: UNATHORIZED, message: INVALID_SESSION, data: error });
  }
};

module.exports = {
  verifyToken,
  verifyRefreshToken,
};
