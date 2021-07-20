const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { RATE_LIMIT, HTTP_CODES, HTTP_MESSAGES } = require("./helpers/constants");

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HTTP_CODES;
const { ERROR, NOT_FOUND_MSG, FAIL } = HTTP_MESSAGES;

const { APIlimiter } = require("./helpers/constants");
const cookieParser = require("cookie-parser");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());

app.use(logger(formatsLogger));

app.use(cors());

app.use(express.json({ limit: RATE_LIMIT }));

app.use(cookieParser());

app.use("/api/", rateLimit(APIlimiter));

app.use("/api/", require("./routes/api"));

app.use((req, res) => {
  res.status(NOT_FOUND).json({ status: ERROR, code: NOT_FOUND, message: NOT_FOUND_MSG });
});

app.use((err, req, res, next) => {
  res
    .status(INTERNAL_SERVER_ERROR)
    .json({ status: FAIL, code: INTERNAL_SERVER_ERROR, message: err.message });
});

module.exports = app;
