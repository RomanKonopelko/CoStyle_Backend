"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionById = exports.updateTransaction = exports.removeTransaction = exports.addTransaction = exports.getAllTransactions = void 0;
const transactionSchema_1 = __importDefault(require("../model/transactionSchema"));
const getAllTransactions = async (userId, query, options) => {
    const { pagination = true } = options;
    const { sortBy, sortByDesc = "createdAt", month = null, year = null, limit = 5, offset = 0, } = query;
    const optionSearch = {
        owner: userId,
    };
    if (month !== null) {
        Object.assign(optionSearch, { "time.month": month });
    }
    if (year !== null) {
        Object.assign(optionSearch, { "time.year": year });
    }
    const result = await transactionSchema_1.default.paginate(optionSearch, {
        pagination,
        limit,
        offset,
        sort: {
            ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
            ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
        },
        populate: { path: "owner", select: "balanceValue -_id" },
    });
    return result;
};
exports.getAllTransactions = getAllTransactions;
const addTransaction = async (userId, body, convertedTime, balance, color) => {
    const result = await transactionSchema_1.default.create({
        owner: userId,
        ...body,
        ...convertedTime,
        ...balance,
        color,
    });
    return result;
};
exports.addTransaction = addTransaction;
const getTransactionById = async (userId, id) => {
    const result = await transactionSchema_1.default.findOne({ _id: id, owner: userId }).populate({
        path: "owner",
        select: "balanceValue -_id",
    });
    return result;
};
exports.getTransactionById = getTransactionById;
const removeTransaction = async (userId, id) => {
    const result = await transactionSchema_1.default.findOneAndRemove({ _id: id, owner: userId });
    return result;
};
exports.removeTransaction = removeTransaction;
const updateTransaction = async (userId, id, body) => {
    const result = await transactionSchema_1.default.findOneAndUpdate({ _id: id, owner: userId }, { ...body }, { new: true });
    return result;
};
exports.updateTransaction = updateTransaction;
