import { ICategory, ITransaction, ITransactionValue } from "./interfaces/interfaces";
import CreateSenderNodemailer from "../services/email-sender";
import EmailService from "../services/emailGeneration";
import { HTTP_CODES, HTTP_MESSAGES } from "./constants";
const { OK, CONFLICT } = HTTP_CODES;
const { SUCCESS, ERROR, EMAIL_IS_VERIFIED, RESUBMITTED } = HTTP_MESSAGES;
import { findByVerifyToken, updateVerifyToken, findByEmail } from "../repositories/user";
import { NextFunction, Request, Response } from "express";
require("dotenv").config();

const GET_CATEGORY_COLOR = function (arr: ICategory[], category: string) {
  if (!category) return null;
  const color = arr.find((e) => e[1].title === category)[1].color;
  return color;
};

const GET_INCOME_AMOUNT = function (arr: ITransaction[]) {
  const incomeArr = arr.filter((e) => e.sort === "Доход").map((e) => e.amount);
  const summaryValue = incomeArr.reduce((acc, value) => acc + value, 0);
  return summaryValue;
};

const GET_CONSUMPTION_AMOUNT = function (arr: ITransaction[]) {
  const consumptionArr = arr.filter((e) => e.sort === "Расход").map((e) => e.amount);
  const summaryValue = consumptionArr.reduce((acc, value) => acc + value, 0);
  return summaryValue;
};

const GET_CATEGORY_AMOUNT = function (arr: ITransaction[], categories: ICategory[]) {
  const incomeArr = arr.filter((e) => e.sort === "Расход");
  const amountObj: ITransactionValue = incomeArr.reduce((acc: ITransactionValue, value) => {
    return (
      acc[value.category]
        ? (acc[value.category] = {
            value: (acc[value.category].value += value.amount),
            color: acc[value.category].color,
          })
        : (acc[value.category] = {
            value: value.amount,
            color: categories.find((e) => (e[1].title === value.category ? e[1].color : null))[1]
              .color,
          }),
      acc
    );
  }, {});
  return amountObj;
};

const GET_BALANCE_AMOUNT = function (sort: string, amount: number, balance: number) {
  balance = sort === "Доход" ? (balance += amount) : (balance -= amount);
  return { balance };
};

const UPDATE_BALANCE_AMOUNT = function (sort: string, amount: number, balance: number) {
  balance = sort === "Доход" ? (balance -= amount) : (balance += amount);
  return { balance };
};

const UPDATE_TRANSACTIONS_BALANCE = function (arr: ITransaction[], transaction: ITransaction) {
  const dataSelectedArr = arr.filter((el) =>
    el.time.date > transaction.time.date ? el : el.createdAt > transaction.createdAt
  );
  const updatedBalanceArr = dataSelectedArr.map((el) => {
    transaction.sort === "Доход"
      ? (el.balance -= transaction.amount)
      : (el.balance += transaction.amount);
    return el;
  });
  return updatedBalanceArr;
};

const TO_CONVERT_TIME = function (time: string) {
  const [year, month, day] = time.split("-").map(Number);
  return {
    time: {
      date: new Date(year, month - 1, day),
      month: month + "",
      year: year + "",
    },
  };
};

const VERIFY_TOKEN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findByVerifyToken(req.params.token);
    if (user) {
      await updateVerifyToken(user.id, true, null);
      return res.render("verifiedEmail/index");
    }
    return res.render("unverifiedEmail/index");
  } catch (error) {
    next(error);
  }
};

const REPEAT_EMAIL_VERIFICATION = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findByEmail(req.body.email);
    if (user) {
      const { name, email, isVerified, verifyToken } = user;
      if (!isVerified) {
        const emailGen = new CreateSenderNodemailer();
        const emailService = new EmailService(process.env.NODE_ENV, emailGen);
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
    await res.status(HTTP_CODES.NOT_FOUND);
    return res.json({
      status: ERROR,
      code: HTTP_CODES.NOT_FOUND,
      message: HTTP_MESSAGES.NOT_FOUND,
    });
  } catch (error) {
    next(error);
  }
};

export {
  GET_INCOME_AMOUNT,
  GET_CONSUMPTION_AMOUNT,
  GET_CATEGORY_AMOUNT,
  GET_CATEGORY_COLOR,
  GET_BALANCE_AMOUNT,
  TO_CONVERT_TIME,
  VERIFY_TOKEN,
  REPEAT_EMAIL_VERIFICATION,
  UPDATE_TRANSACTIONS_BALANCE,
  UPDATE_BALANCE_AMOUNT,
};
