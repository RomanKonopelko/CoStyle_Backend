const Transaction = require("../repositories/transactions");
const { HTTP_CODES, HTTP_MESSAGES } = require("../helpers/constants");

const { OK, NOT_FOUND, CREATED } = HTTP_CODES;
const { NOT_FOUND_MSG, SUCCESS, DELETED, MISSING_FIELDS, ERROR, TRANSACTION_CREATED } =
  HTTP_MESSAGES;

const getAllTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.getAllTransactions(userId);
    return res.status(OK).json({
      status: SUCCESS,
      code: OK,
      payload: { transactions },
    });
  } catch (error) {
    next(error);
  }
};

const addTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transaction = await Transaction.addTransaction(userId, req.body);
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

module.exports = { getAllTransactions, addTransaction };
