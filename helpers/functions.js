"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_BALANCE_AMOUNT = exports.UPDATE_TRANSACTIONS_BALANCE = exports.REPEAT_EMAIL_VERIFICATION = exports.VERIFY_TOKEN = exports.TO_CONVERT_TIME = exports.GET_BALANCE_AMOUNT = exports.GET_CATEGORY_COLOR = exports.GET_CATEGORY_AMOUNT = exports.GET_CONSUMPTION_AMOUNT = exports.GET_INCOME_AMOUNT = void 0;
const email_sender_1 = __importDefault(require("../services/email-sender"));
const emailGeneration_1 = __importDefault(require("../services/emailGeneration"));
const constants_1 = require("./constants");
const { OK, CONFLICT } = constants_1.HTTP_CODES;
const { SUCCESS, ERROR, EMAIL_IS_VERIFIED, RESUBMITTED } = constants_1.HTTP_MESSAGES;
const user_1 = require("../repositories/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GET_CATEGORY_COLOR = function (arr, category) {
    if (!category || !arr)
        return null;
    const color = arr.find((e) => e[1].title === category)[1].color;
    return color;
};
exports.GET_CATEGORY_COLOR = GET_CATEGORY_COLOR;
const GET_INCOME_AMOUNT = function (arr) {
    const incomeArr = arr.filter((e) => e.sort === "Доход").map((e) => e.amount);
    const summaryValue = incomeArr.reduce((acc, value) => acc + value, 0);
    return summaryValue;
};
exports.GET_INCOME_AMOUNT = GET_INCOME_AMOUNT;
const GET_CONSUMPTION_AMOUNT = function (arr) {
    const consumptionArr = arr.filter((e) => e.sort === "Расход").map((e) => e.amount);
    const summaryValue = consumptionArr.reduce((acc, value) => acc + value, 0);
    return summaryValue;
};
exports.GET_CONSUMPTION_AMOUNT = GET_CONSUMPTION_AMOUNT;
const GET_CATEGORY_AMOUNT = function (arr, categories) {
    const incomeArr = arr.filter((e) => e.sort === "Расход");
    const amountObj = incomeArr.reduce((acc, value) => {
        return (acc[value.category]
            ? (acc[value.category] = {
                value: (acc[value.category].value += value.amount),
                color: acc[value.category].color,
            })
            : (acc[value.category] = {
                value: value.amount,
                color: categories.find((e) => (e[1].title === value.category ? e[1].color : null))[1]
                    .color,
            }),
            acc);
    }, {});
    return amountObj;
};
exports.GET_CATEGORY_AMOUNT = GET_CATEGORY_AMOUNT;
const GET_BALANCE_AMOUNT = function (sort, amount, balance) {
    balance = sort === "Доход" ? (balance += amount) : (balance -= amount);
    return { balance };
};
exports.GET_BALANCE_AMOUNT = GET_BALANCE_AMOUNT;
const UPDATE_BALANCE_AMOUNT = function (sort, amount, balance) {
    balance = sort === "Доход" ? (balance -= amount) : (balance += amount);
    return { balance };
};
exports.UPDATE_BALANCE_AMOUNT = UPDATE_BALANCE_AMOUNT;
const UPDATE_TRANSACTIONS_BALANCE = function (arr, transaction) {
    const dataSelectedArr = arr.filter((el) => el.time.date > transaction.time.date ? el : el.createdAt > transaction.createdAt);
    const updatedBalanceArr = dataSelectedArr.map((el) => {
        transaction.sort === "Доход"
            ? (el.balance -= transaction.amount)
            : (el.balance += transaction.amount);
        return el;
    });
    return updatedBalanceArr;
};
exports.UPDATE_TRANSACTIONS_BALANCE = UPDATE_TRANSACTIONS_BALANCE;
const TO_CONVERT_TIME = function (time) {
    const [year, month, day] = time.split("-").map(Number);
    return {
        time: {
            date: new Date(year, month - 1, day),
            month: month + "",
            year: year + "",
        },
    };
};
exports.TO_CONVERT_TIME = TO_CONVERT_TIME;
const VERIFY_TOKEN = async (req, res, next) => {
    try {
        const user = await user_1.findByVerifyToken(req.params.token);
        if (user) {
            await user_1.updateVerifyToken(user.id, true, null);
            return res.render("verifiedEmail/index");
        }
        return res.render("unverifiedEmail/index");
    }
    catch (error) {
        next(error);
    }
};
exports.VERIFY_TOKEN = VERIFY_TOKEN;
const REPEAT_EMAIL_VERIFICATION = async (req, res, next) => {
    try {
        const user = await user_1.findByEmail(req.body.email);
        if (user) {
            const { name, email, isVerified, verifyToken } = user;
            if (!isVerified) {
                const emailGen = new email_sender_1.default();
                const emailService = new emailGeneration_1.default(process.env.NODE_ENV, emailGen);
                await emailService.sendVerifyEmail(verifyToken, email, name);
                await res.status(OK);
                return res.json({
                    status: SUCCESS,
                    code: OK,
                    message: RESUBMITTED,
                });
            }
            await res.status(CONFLICT);
            return res.json({
                status: ERROR,
                code: CONFLICT,
                message: EMAIL_IS_VERIFIED,
            });
        }
        await res.status(constants_1.HTTP_CODES.NOT_FOUND);
        return res.json({
            status: ERROR,
            code: constants_1.HTTP_CODES.NOT_FOUND,
            message: constants_1.HTTP_MESSAGES.NOT_FOUND,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.REPEAT_EMAIL_VERIFICATION = REPEAT_EMAIL_VERIFICATION;
