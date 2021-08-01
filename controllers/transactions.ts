import * as Transaction from "../repositories/transactions";
import { updateBalance } from "../repositories/user";
import { Response, Request, NextFunction } from "express";
import { HTTP_CODES, HTTP_MESSAGES, TRANSACTION_CATEGORIES } from "../helpers/constants";
import { GET_CATEGORY_COLOR } from "../helpers/functions";
import { ICategory } from "../helpers/interfaces/interfaces";

import {
  GET_INCOME_AMOUNT,
  GET_CONSUMPTION_AMOUNT,
  UPDATE_TRANSACTIONS_BALANCE,
  GET_CATEGORY_AMOUNT,
  TO_CONVERT_TIME,
  GET_BALANCE_AMOUNT,
  UPDATE_BALANCE_AMOUNT,
} from "../helpers/functions";

const { OK, CREATED, NOT_FOUND } = HTTP_CODES;
const { SUCCESS, TRANSACTION_CREATED, DELETED, MISSING_FIELDS, ERROR, NOT_FOUND_MSG } =
  HTTP_MESSAGES;
const CATEGORIES: ICategory[] = Object.entries(TRANSACTION_CATEGORIES);

const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const options = { pagination: true };
    const { docs: transactions, ...rest } = await Transaction.getAllTransactions(
      userId,
      req.query,
      options
    );
    return res.status(OK).json({
      status: SUCCESS,
      code: OK,
      payload: { transactions, ...rest },
    });
  } catch (error) {
    next(error);
  }
};

const addTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { balanceValue } = req.user;
    const { sort, amount, time, category } = req.body;

    const convertedTime = TO_CONVERT_TIME(time);
    const balance = GET_BALANCE_AMOUNT(sort, amount, balanceValue);
    const categoryColor = GET_CATEGORY_COLOR(CATEGORIES, category);
    const transaction = await Transaction.addTransaction(
      userId,
      req.body,
      convertedTime,
      balance,
      categoryColor
    );

    await updateBalance(userId, balance);

    return res.status(CREATED).json({
      status: SUCCESS,
      code: CREATED,
      message: TRANSACTION_CREATED,
      payload: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionStatistic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { balanceValue } = req.user;
    const options = { pagination: false };
    const { docs: transactions } = await Transaction.getAllTransactions(userId, req.query, options);
    const incomeValue = GET_INCOME_AMOUNT(transactions);
    const consumptionValue = GET_CONSUMPTION_AMOUNT(transactions);
    const categoriesSummary = GET_CATEGORY_AMOUNT(transactions, CATEGORIES);
    return res.status(OK).json({
      status: SUCCESS,
      code: OK,
      payload: { incomeValue, consumptionValue, balanceValue, categoriesSummary },
    });
  } catch (error) {
    next(error);
  }
};

const removeTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { balanceValue } = req.user;
    const options = { pagination: false };
    const { docs: transactions, ...rest } = await Transaction.getAllTransactions(
      userId,
      req.query,
      options
    );
    const transaction = await Transaction.removeTransaction(userId, req.params.transactionId);

    if (!transaction) res.json({ status: ERROR, code: NOT_FOUND, message: NOT_FOUND_MSG });

    const { sort, amount } = transaction;
    const updatedTransactions = UPDATE_TRANSACTIONS_BALANCE(transactions, transaction);
    const userBalance = UPDATE_BALANCE_AMOUNT(sort, amount, balanceValue);

    await updateBalance(userId, userBalance);

    updatedTransactions.forEach(async (el) => {
      const { balance } = el;
      return await Transaction.updateTransaction(userId, el.id, { balance });
    });

    return res
      .status(OK)
      .json({ status: SUCCESS, code: OK, message: DELETED, payload: { transaction } });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { balanceValue } = req.user;

    if (req.body.time) {
      const convertedTime = TO_CONVERT_TIME(req.body.time);
      req.body.time = convertedTime;
    }

    if (req.body.amount) {
      const balance = GET_BALANCE_AMOUNT(req.body.sort, req.body.amount, balanceValue);
      req.body.balance = balance;
      await updateBalance(userId, balance);
    }

    const transaction = await Transaction.updateTransaction(
      userId,
      req.params.transactionId,
      req.body
    );

    if (Object.keys(req.body).length === 0)
      return res
        .status(NOT_FOUND)
        .json({ status: ERROR, code: NOT_FOUND, message: MISSING_FIELDS });

    if (transaction)
      return res.status(CREATED).json({ status: SUCCESS, code: CREATED, payload: { transaction } });

    return res.json({ status: ERROR, code: NOT_FOUND, message: NOT_FOUND_MSG });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  addTransaction,
  getTransactionStatistic,
  removeTransaction,
  updateTransaction,
};
