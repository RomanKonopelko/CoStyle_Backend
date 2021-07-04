const Transactions = require("../model/transactionScheme");

const getAllTransactions = async () => {
    const result = await Transactions.find();
    return result
}

const get