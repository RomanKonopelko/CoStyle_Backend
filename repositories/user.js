"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByVerifyToken = exports.updateVerifyToken = exports.updateBalance = exports.updateToken = exports.create = exports.findById = exports.findByEmail = void 0;
const userSchema_1 = __importDefault(require("../model/userSchema"));
const findById = async (id) => await userSchema_1.default.findById(id);
exports.findById = findById;
const findByEmail = async (email) => await userSchema_1.default.findOne({ email });
exports.findByEmail = findByEmail;
const create = async (body) => {
    const user = new userSchema_1.default(body);
    return await user.save();
};
exports.create = create;
const updateBalance = async (id, balance) => {
    return await userSchema_1.default.updateOne({ _id: id }, { balanceValue: balance.balance });
};
exports.updateBalance = updateBalance;
const updateToken = async (id, token) => {
    return await userSchema_1.default.updateOne({ _id: id }, { token });
};
exports.updateToken = updateToken;
const updateVerifyToken = async (id, isVerified, verifyToken) => {
    return await userSchema_1.default.updateOne({ _id: id }, { isVerified, verifyToken });
};
exports.updateVerifyToken = updateVerifyToken;
const findByVerifyToken = async (verifyToken) => {
    return await userSchema_1.default.findOne({ verifyToken });
};
exports.findByVerifyToken = findByVerifyToken;
