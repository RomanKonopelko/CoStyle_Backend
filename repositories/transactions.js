const Transaction = require("../model/transactionSchema");

const getAllTransactions = async (userId, query, options) => {
  const { pagination = true } = options;
  const {
    sortBy,
    sortByDesc = "createdAt",
    month = null,
    year = null,
    limit = 5,
    offset = 0,
  } = query;
  const optionSearch = {
    owner: userId,
  };
  if (month !== null) {
    Object.assign(optionSearch, { "time.month": month });
  }
  if (year !== null) {
    Object.assign(optionSearch, { "time.year": year });
  }

  console.log(optionSearch);

  const result = await Transaction.paginate(optionSearch, {
    pagination,
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    populate: { path: "owner", select: "balanceValue -_id" },
  });
  console.log(result);
  return result;
};

const addTransaction = async (userId, body, convertedTime, balance) => {
  const result = await Transaction.create({ owner: userId, ...body, ...convertedTime, ...balance });
  return result;
};

module.exports = { getAllTransactions, addTransaction };
