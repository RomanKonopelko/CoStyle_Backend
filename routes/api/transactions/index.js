const express = require("express");
const guard = require("../../../middlewares/guard");
const {
  getAllTransactions,
  addTransaction,
  getTransactionStatistic,
} = require("../../../controllers/transactions");

const { validatedNewTransaction } = require("../../../middlewares/validation");

const router = express.Router();

router.get("/", guard, getAllTransactions);

router.post("/", guard, validatedNewTransaction, addTransaction);

router.get("/statistic", guard, getTransactionStatistic);

module.exports = router;
