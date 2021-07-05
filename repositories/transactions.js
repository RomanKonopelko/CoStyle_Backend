const Transaction = require("../model/transactionSchema");

const getAllTransactions = async () => {
  const result = await Transaction.find();
  return result;
};

const addTransaction = async (body) => {
  const result = await Transaction.create(body);
  return result;
};

module.exports = { getAllTransactions, addTransaction };
