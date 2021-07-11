const Transaction = require("../model/transactionSchema");

const getAllTransactions = async (userId, query) => {
  console.log(query);
  const { month = null, year = null, limit = 5, offset = 0 } = query;
  const optionSearch = { owner: userId };
  if (month !== null) optionSearch.month = month;
  if (year !== null) optionSearch.year = year;
  const result = await Transaction.paginate(optionSearch, {
    limit,
    offset,
    populate: { path: "owner", select: "balanceValue -_id" },
  });
  return result;
};

const addTransaction = async (userId, body, balance, time) => {
  console.log(time);
  const result = await Transaction.create({ owner: userId, ...body, ...balance, ...time });
  return result;
};

module.exports = { getAllTransactions, addTransaction };
