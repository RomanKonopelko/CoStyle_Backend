const express = require("express");
const router = express.Router();

const transactionRouter = require("./transactions");
const usersRouter = require("./user");

router.use("/users", usersRouter);
router.use("/transactions", transactionRouter);

module.exports = router;
