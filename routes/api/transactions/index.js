const express = require("express");
const guard = require("../../../helpers/guard");
const { getAllTransactions, addTransaction } = require("../../../controllers/transactions");

const router = express.Router();

router.get("/", guard, getAllTransactions);

router.post("/", guard, addTransaction);

module.exports = router;
