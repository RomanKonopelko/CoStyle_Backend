const Transaction = require("../repositories/transactions");
const { updateBalance } = require("../repositories/user");
const {
  HTTP_CODES,
  HTTP_MESSAGES,
  GET_INCOME_AMOUNT,
  GET_CONSUMPTION_AMOUNT,
  TRANSACTION_CATEGORIES,
  GET_CATEGORY_AMOUNT,
  TO_CONVERT_TIME,
  GET_BALANCE_AMOUNT,
} = require("../helpers/constants");

const { OK, NOT_FOUND, CREATED } = HTTP_CODES;
const { NOT_FOUND_MSG, SUCCESS, DELETED, MISSING_FIELDS, ERROR, TRANSACTION_CREATED } =
  HTTP_MESSAGES;
const CATEGORIES = Object.entries(TRANSACTION_CATEGORIES);

const getAllTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { docs: transactions, ...rest } = await Transaction.getAllTransactions(userId, req.query);
    return res.status(OK).json({
      status: SUCCESS,
      code: OK,
      payload: { transactions, ...rest },
    });
  } catch (error) {
    next(error);
  }
};

const addTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { balanceValue } = req.user;
    const { sort, amount, time } = req.body;

    const convertedTime = await TO_CONVERT_TIME(time);
    const balance = await GET_BALANCE_AMOUNT(sort, amount, balanceValue);
    const transaction = await Transaction.addTransaction(userId, req.body, balance, convertedTime);

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

const getTransactionStatistic = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { balanceValue } = req.user;
    const { docs: transactions, ...rest } = await Transaction.getAllTransactions(userId, req.query);
    const incomeValue = await GET_INCOME_AMOUNT(transactions);
    const consumptionValue = await GET_CONSUMPTION_AMOUNT(transactions);
    const categoriesSummary = await GET_CATEGORY_AMOUNT(transactions, CATEGORIES);
    return res.status(OK).json({
      status: SUCCESS,
      code: OK,
      payload: { incomeValue, consumptionValue, balanceValue, categoriesSummary, ...rest },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTransactions, addTransaction, getTransactionStatistic };
