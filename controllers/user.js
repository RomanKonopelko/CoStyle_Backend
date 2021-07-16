const User = require("../repositories/user");
const jwt = require("jsonwebtoken");
const redisClient = require("../model/redis");
const { GENERATE_REFRESH_TOKEN } = require("../helpers/tokenCreation");
const { HTTP_CODES, HTTP_MESSAGES } = require("../helpers/constants");

require("dotenv").config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_ACCESS_TIME = process.env.JWT_ACCESS_TIME;

const { ERROR, SUCCESS, EMAIL_IS_USED, INVALID_CREDENTIALS } = HTTP_MESSAGES;
const { CONFLICT, CREATED, OK, UNAUTHORIZED, NO_CONTENT } = HTTP_CODES;

const registerUser = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (user) {
      return res.status(CONFLICT).json({ status: ERROR, code: CONFLICT, message: EMAIL_IS_USED });
    }

    const { id, email, name, balanceValue } = await User.create(req.body);
    const payload = { id };
    const token = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_TIME,
    });

    await User.updateToken(id, token);
    return res
      .status(CREATED)
      .json({ status: SUCCESS, code: CREATED, payload: { id, email, name, balanceValue } });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      return res
        .status(UNAUTHORIZED)
        .json({ status: ERROR, code: CONFLICT, message: INVALID_CREDENTIALS });
    }
    const { name, id, email } = user;
    const payload = { id };
    const token = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_TIME,
    });
    const refreshToken = await GENERATE_REFRESH_TOKEN(id);
    await User.updateToken(id, token);
    return res.json({ status: SUCCESS, code: OK, payload: { token, refreshToken, name, email } });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const token = req.token;
    await User.updateToken(id, null);
    await redisClient.del(id);
    await redisClient.set("BlackList_" + id, token);

    return res.status(NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const getCurrentUserData = async (req, res, next) => {
  try {
    const { email, name, balanceValue } = req.user;
    return await res
      .status(OK)
      .json({ status: SUCCESS, code: OK, payload: { email, name, balanceValue } });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, logoutUser, getCurrentUserData };
