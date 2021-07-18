const express = require("express");
const guard = require("../../../middlewares/guard");
const {
  getAllTransactions,
  addTransaction,
  getTransactionStatistic,
  removeTransaction,
  updateTransaction,
} = require("../../../controllers/transactions");

const {
  validatedNewTransaction,
  validatedUpdateTransaction,
  validatedTransactionId,
} = require("../../../middlewares/validation");

const router = express.Router();

router.get("/", guard, getAllTransactions);

router.post("/", guard, validatedNewTransaction, addTransaction);

router.get("/statistic", guard, getTransactionStatistic);

router.delete("/:transactionId", guard, validatedTransactionId, removeTransaction);

router.put(
  "/:transactionId",
  guard,
  validatedTransactionId,
  validatedUpdateTransaction,
  updateTransaction
);

module.exports = router;
