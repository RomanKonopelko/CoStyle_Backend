"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERATE_REFRESH_TOKEN = exports.GET_ACCESS_TOKEN = void 0;
const redis_1 = __importDefault(require("../model/redis"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User = __importStar(require("../repositories/user"));
const constants_1 = require("../helpers/constants");
const { OK } = constants_1.HTTP_CODES;
const { SUCCESS } = constants_1.HTTP_MESSAGES;
const GET_ACCESS_TOKEN = async (req, res, next) => {
    try {
        const { id } = req.user;
        const payload = { id };
        const usedToken = req.headers.authorization.split(" ")[1];
        redis_1.default.set("Blacklist_" + id, usedToken);
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TIME,
        });
        const refreshToken = GENERATE_REFRESH_TOKEN(id);
        await User.updateToken(id, token);
        return res.json({ status: OK, message: SUCCESS, payload: { token, refreshToken } });
    }
    catch (err) {
        next(err);
    }
};
exports.GET_ACCESS_TOKEN = GET_ACCESS_TOKEN;
const GENERATE_REFRESH_TOKEN = function async(id) {
    const payload = { id };
    const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TIME,
    });
    redis_1.default.set(id, JSON.stringify({ token: refreshToken }));
    return refreshToken;
};
exports.GENERATE_REFRESH_TOKEN = GENERATE_REFRESH_TOKEN;
