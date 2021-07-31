import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import cors from "cors";
const app = express();
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import { RATE_LIMIT, HTTP_CODES, HTTP_MESSAGES } from "./helpers/constants";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HTTP_CODES;
const { ERROR, NOT_FOUND_MSG, FAIL } = HTTP_MESSAGES;

import { APIlimiter } from "./helpers/constants";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.static(__dirname + "/views"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(helmet());

app.use(logger(formatsLogger));

app.use(cors());

app.use(express.json({ limit: RATE_LIMIT }));

app.use("/api/", rateLimit(APIlimiter));

app.use("/api/", require("./routes/api"));

app.use((req, res) => {
  res.status(NOT_FOUND).json({ status: ERROR, code: NOT_FOUND, message: NOT_FOUND_MSG });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res
    .status(INTERNAL_SERVER_ERROR)
    .json({ status: FAIL, code: INTERNAL_SERVER_ERROR, message: err.message });
});

export default app;
