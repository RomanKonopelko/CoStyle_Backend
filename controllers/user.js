const User = require("../repositories/user");
const jwt = require("jsonwebtoken");
const { HTTP_CODES, HTTP_MESSAGES } = require("../helpers/constants");

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

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
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await User.updateToken(id, token);
    return res
      .status(CREATED)
      .json({ status: SUCCESS, code: CREATED, payload: { id, email, name, balanceValue, token } });
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
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await User.updateToken(id, token);
    return res.json({ status: SUCCESS, code: OK, payload: { token, name, email } });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    await User.updateToken(id, null);
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
