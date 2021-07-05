const Transaction = require("../model/transactionSchema");

const getAllTransactions = async (userId) => {
  const result = await Transaction.find({ owner: userId }).populate({
    path: "owner",
    select: "email",
  });
  return result;
};

const addTransaction = async (body) => {
  const result = await Transaction.create(body);
  return result;
};

module.exports = { getAllTransactions, addTransaction };
