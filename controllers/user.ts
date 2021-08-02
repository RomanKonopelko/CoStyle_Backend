import * as User from "../repositories/user";
import jwt from "jsonwebtoken";
import redisClient from "../model/redis";
import { GENERATE_REFRESH_TOKEN } from "../helpers/tokenCreation";
import { HTTP_CODES, HTTP_MESSAGES } from "../helpers/constants";
import EmailService from "../services/emailGeneration";
import CreateSenderNodemailer from "../services/email-sender";
import { Response, Request, NextFunction } from "express";
import { PaginateModel } from "mongoose";
import { IUserData } from "../helpers/interfaces/interfaces";

require("dotenv").config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_ACCESS_TIME = process.env.JWT_ACCESS_TIME;

const { ERROR, SUCCESS, EMAIL_IS_USED, INVALID_CREDENTIALS, EMAIL_IS_NOT_VERIFIED } = HTTP_MESSAGES;
const { CONFLICT, CREATED, OK, UNAUTHORIZED, NO_CONTENT } = HTTP_CODES;

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: PaginateModel<any> = await User.findByEmail(req.body.email);

    if (user) {
      return res.status(CONFLICT).json({ status: ERROR, code: CONFLICT, message: EMAIL_IS_USED });
    }

    const { id, email, name, balanceValue, verifyToken } = await User.create(req.body);

    const emailService = new EmailService(process.env.NODE_ENV, new CreateSenderNodemailer());

    await emailService.sendVerifyEmail(verifyToken, email, name);

    const payload = { id };
    const token = jwt.sign(payload, JWT_ACCESS_SECRET!, {
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

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: IUserData = await User.findByEmail(req.body.email);
    const isValidPassword = user?.isValidPassword(req.body.password);
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
    const token = jwt.sign(payload, JWT_ACCESS_SECRET!, {
      expiresIn: JWT_ACCESS_TIME,
    });
    const refreshToken = GENERATE_REFRESH_TOKEN(id);
    await User.updateToken(id, token);
    return res.json({ status: SUCCESS, code: OK, payload: { token, refreshToken, name, email } });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.user.id;
    const token = req.token;
    await User.updateToken(id, null);
    redisClient.del(id);
    redisClient.set("BlackList_" + id, token);

    return res.status(NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const getCurrentUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, balanceValue } = req.user;
    return res
      .status(OK)
      .json({ status: SUCCESS, code: OK, payload: { email, name, balanceValue } });
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser, logoutUser, getCurrentUserData };
