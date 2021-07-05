const Transaction = require("../model/transactionSchema");

const getAllTransactions = async (userId) => {
  const result = await Transaction.find({ owner: userId }).populate({
    path: "owner",
    select: "email",
  });
  return result;
};

const addTransaction = async (userId, body) => {
  const result = await Transaction.create({ owner: userId, ...body });
  return result;
};

module.exports = { getAllTransactions, addTransaction };
