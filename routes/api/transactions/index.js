const express = require("express");
const guard = require("../../../helpers/guard");
const { getAllTransactions, addTransaction } = require("../../../controllers/transactions");
const { validatedNewTransaction } = require("../../../helpers/validation");

const router = express.Router();

router.get("/", guard, getAllTransactions);

router.post("/", guard, validatedNewTransaction, addTransaction);

module.exports = router;
