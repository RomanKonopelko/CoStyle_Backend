import redisClient from "../model/redis";
import jwt from "jsonwebtoken";
import * as User from "../repositories/user";
import { HTTP_CODES, HTTP_MESSAGES } from "../helpers/constants";
import { Response, Request, NextFunction } from "express";

const { OK } = HTTP_CODES;
const { SUCCESS } = HTTP_MESSAGES;

const GET_ACCESS_TOKEN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    const payload = { id };
    const usedToken = req.headers.authorization!.split(" ")[1];

    redisClient.set("Blacklist_" + id, usedToken);

    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: process.env.JWT_ACCESS_TIME,
    });

    const refreshToken = GENERATE_REFRESH_TOKEN(id);
    await User.updateToken(id, token);

    return res.json({ status: OK, message: SUCCESS, payload: { token, refreshToken } });
  } catch (err) {
    next(err);
  }
};

const GENERATE_REFRESH_TOKEN = function async(id: string) {
  const payload = { id };
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_TIME,
  });

  redisClient.set(id, JSON.stringify({ token: refreshToken }));

  return refreshToken;
};

export { GET_ACCESS_TOKEN, GENERATE_REFRESH_TOKEN };
