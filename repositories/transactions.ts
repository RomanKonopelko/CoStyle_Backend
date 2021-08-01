import { IConvertedTime, ITransactionBody } from "../helpers/interfaces/interfaces";
import Transaction from "../model/transactionSchema";

const getAllTransactions = async (userId: string, query: any, options: { pagination: boolean }) => {
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

  return result;
};

const addTransaction = async (
  userId: string,
  body: ITransactionBody,
  convertedTime: IConvertedTime,
  balance: { balance: number },
  color: string | null
) => {
  const result = await Transaction.create({
    owner: userId,
    ...body,
    ...convertedTime,
    ...balance,
    color,
  });
  return result;
};

const getTransactionById = async (userId: string, id: string) => {
  const result = await Transaction.findOne({ _id: id, owner: userId }).populate({
    path: "owner",
    select: "balanceValue -_id",
  });
  return result;
};

const removeTransaction = async (userId: string, id: string) => {
  const result = await Transaction.findOneAndRemove({ _id: id, owner: userId });
  return result;
};

const updateTransaction = async (userId: string, id: string, body: ITransactionBody) => {
  const result = await Transaction.findOneAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

export {
  getAllTransactions,
  addTransaction,
  removeTransaction,
  updateTransaction,
  getTransactionById,
};
