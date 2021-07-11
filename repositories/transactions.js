const Transaction = require("../model/transactionSchema");

const getAllTransactions = async (userId, query, options) => {
  const { pagination } = options;
  const { month = null, year = null, limit = 5, offset = 0 } = query;
  const optionSearch = { owner: userId };
  if (month !== null) optionSearch.month = month;
  if (year !== null) optionSearch.year = year;

  const result = await Transaction.paginate(optionSearch, {
    pagination,
    limit,
    offset,
    populate: { path: "owner", select: "balanceValue -_id" },
  });
  return result;
};

const addTransaction = async (userId, body, balance, time) => {
  const result = await Transaction.create({ owner: userId, ...body, ...balance, ...time });
  return result;
};

module.exports = { getAllTransactions, addTransaction };
