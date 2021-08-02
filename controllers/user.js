"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserData = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const User = __importStar(require("../repositories/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../model/redis"));
const tokenCreation_1 = require("../helpers/tokenCreation");
const constants_1 = require("../helpers/constants");
const emailGeneration_1 = __importDefault(require("../services/emailGeneration"));
const email_sender_1 = __importDefault(require("../services/email-sender"));
require("dotenv").config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_ACCESS_TIME = process.env.JWT_ACCESS_TIME;
const { ERROR, SUCCESS, EMAIL_IS_USED, INVALID_CREDENTIALS, EMAIL_IS_NOT_VERIFIED } =
  constants_1.HTTP_MESSAGES;
const { CONFLICT, CREATED, OK, UNAUTHORIZED, NO_CONTENT } = constants_1.HTTP_CODES;
const registerUser = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (user) {
      return res.status(CONFLICT).json({ status: ERROR, code: CONFLICT, message: EMAIL_IS_USED });
    }
    const { id, email, name, balanceValue, verifyToken } = await User.create(req.body);
    const emailService = new emailGeneration_1.default(
      process.env.NODE_ENV,
      new email_sender_1.default()
    );
    await emailService.sendVerifyEmail(verifyToken, email, name);
    const payload = { id };
    const token = jsonwebtoken_1.default.sign(payload, JWT_ACCESS_SECRET, {
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
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    console.log(isValidPassword);
    if (!user?.isVerified)
      return res
        .status(CONFLICT)
        .json({ status: ERROR, code: CONFLICT, message: EMAIL_IS_NOT_VERIFIED });
    if (!user || !isValidPassword) {
      return res
        .status(UNAUTHORIZED)
        .json({ status: ERROR, code: CONFLICT, message: INVALID_CREDENTIALS });
    }
    const { name, id, email } = user;
    const payload = { id };
    const token = jsonwebtoken_1.default.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_TIME,
    });
    const refreshToken = tokenCreation_1.GENERATE_REFRESH_TOKEN(id);
    await User.updateToken(id, token);
    return res.json({ status: SUCCESS, code: OK, payload: { token, refreshToken, name, email } });
  } catch (error) {
    next(error);
  }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const token = req.token;
    await User.updateToken(id, null);
    redis_1.default.del(id);
    redis_1.default.set("BlackList_" + id, token);
    return res.status(NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};
exports.logoutUser = logoutUser;
const getCurrentUserData = async (req, res, next) => {
  try {
    const { email, name, balanceValue } = req.user;
    return res
      .status(OK)
      .json({ status: SUCCESS, code: OK, payload: { email, name, balanceValue } });
  } catch (err) {
    next(err);
  }
};
exports.getCurrentUserData = getCurrentUserData;
