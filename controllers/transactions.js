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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransaction = exports.removeTransaction = exports.getTransactionStatistic = exports.addTransaction = exports.getAllTransactions = void 0;
const Transaction = __importStar(require("../repositories/transactions"));
const user_1 = require("../repositories/user");
const constants_1 = require("../helpers/constants");
const functions_1 = require("../helpers/functions");
const functions_2 = require("../helpers/functions");
const { OK, CREATED, NOT_FOUND } = constants_1.HTTP_CODES;
const { SUCCESS, TRANSACTION_CREATED, DELETED, MISSING_FIELDS, ERROR, NOT_FOUND_MSG } = constants_1.HTTP_MESSAGES;
const CATEGORIES = Object.entries(constants_1.TRANSACTION_CATEGORIES);
const getAllTransactions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const options = { pagination: true };
        const { docs: transactions, ...rest } = await Transaction.getAllTransactions(userId, req.query, options);
        return res.status(OK).json({
            status: SUCCESS,
            code: OK,
            payload: { transactions, ...rest },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTransactions = getAllTransactions;
const addTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { balanceValue } = req.user;
        const { sort, amount, time, category } = req.body;
        const convertedTime = functions_2.TO_CONVERT_TIME(time);
        const balance = functions_2.GET_BALANCE_AMOUNT(sort, amount, balanceValue);
        const categoryColor = functions_1.GET_CATEGORY_COLOR(CATEGORIES, category);
        const transaction = await Transaction.addTransaction(userId, req.body, convertedTime, balance, categoryColor);
        await user_1.updateBalance(userId, balance);
        return res.status(CREATED).json({
            status: SUCCESS,
            code: CREATED,
            message: TRANSACTION_CREATED,
            payload: { transaction },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addTransaction = addTransaction;
const getTransactionStatistic = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { balanceValue } = req.user;
        const options = { pagination: false };
        const { docs: transactions } = await Transaction.getAllTransactions(userId, req.query, options);
        const incomeValue = functions_2.GET_INCOME_AMOUNT(transactions);
        const consumptionValue = functions_2.GET_CONSUMPTION_AMOUNT(transactions);
        const categoriesSummary = functions_2.GET_CATEGORY_AMOUNT(transactions, CATEGORIES);
        return res.status(OK).json({
            status: SUCCESS,
            code: OK,
            payload: { incomeValue, consumptionValue, balanceValue, categoriesSummary },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTransactionStatistic = getTransactionStatistic;
const removeTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { balanceValue } = req.user;
        const options = { pagination: false };
        const { docs: transactions, ...rest } = await Transaction.getAllTransactions(userId, req.query, options);
        const transaction = await Transaction.removeTransaction(userId, req.params.transactionId);
        if (!transaction)
            res.json({ status: ERROR, code: NOT_FOUND, message: NOT_FOUND_MSG });
        const { sort, amount } = transaction;
        const updatedTransactions = functions_2.UPDATE_TRANSACTIONS_BALANCE(transactions, transaction);
        const userBalance = functions_2.UPDATE_BALANCE_AMOUNT(sort, amount, balanceValue);
        await user_1.updateBalance(userId, userBalance);
        updatedTransactions.forEach(async (el) => {
            const { balance } = el;
            return await Transaction.updateTransaction(userId, el.id, { balance });
        });
        return res
            .status(OK)
            .json({ status: SUCCESS, code: OK, message: DELETED, payload: { transaction } });
    }
    catch (error) {
        next(error);
    }
};
exports.removeTransaction = removeTransaction;
const updateTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { balanceValue } = req.user;
        if (req.body.time) {
            const convertedTime = functions_2.TO_CONVERT_TIME(req.body.time);
            req.body.time = convertedTime;
        }
        if (req.body.amount) {
            const balance = functions_2.GET_BALANCE_AMOUNT(req.body.sort, req.body.amount, balanceValue);
            req.body.balance = balance;
            await user_1.updateBalance(userId, balance);
        }
        const transaction = await Transaction.updateTransaction(userId, req.params.transactionId, req.body);
        if (Object.keys(req.body).length === 0)
            return res
                .status(NOT_FOUND)
                .json({ status: ERROR, code: NOT_FOUND, message: MISSING_FIELDS });
        if (transaction)
            return res.status(CREATED).json({ status: SUCCESS, code: CREATED, payload: { transaction } });
        return res.json({ status: ERROR, code: NOT_FOUND, message: NOT_FOUND_MSG });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTransaction = updateTransaction;
