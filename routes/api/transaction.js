const express = require("express");
const { getAllTransactions, addTransaction } = require("../../controllers/transactions");

const router = express.Router();

router.get("/", getAllTransactions);

router.post("/", addTransaction);

module.exports = router;
