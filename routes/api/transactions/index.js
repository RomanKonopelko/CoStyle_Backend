const express = require("express");
const guard = require("../../../middlewares/guard");
const {
  getAllTransactions,
  addTransaction,
  getTransactionStatistic,
} = require("../../../controllers/transactions");

const { validatedNewTransaction } = require("../../../middlewares/validation");
const { verifyToken } = require("../../../middlewares/auth.tokenValidation");

const router = express.Router();

router.get("/", guard, verifyToken, getAllTransactions);

router.post("/", guard, verifyToken, validatedNewTransaction, addTransaction);

router.get("/statistic", guard, verifyToken, getTransactionStatistic);

module.exports = router;
