"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const constants_1 = require("./helpers/constants");
const { INTERNAL_SERVER_ERROR, NOT_FOUND } = constants_1.HTTP_CODES;
const { ERROR, NOT_FOUND_MSG, FAIL } = constants_1.HTTP_MESSAGES;
const constants_2 = require("./helpers/constants");
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(express_1.default.static(__dirname + "/views"));
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(helmet_1.default());
app.use(morgan_1.default(formatsLogger));
app.use(cors_1.default());
app.use(express_1.default.json({ limit: constants_1.RATE_LIMIT }));
app.use("/api/", express_rate_limit_1.default(constants_2.APIlimiter));
app.use("/api/", require("./routes/api"));
app.use((req, res) => {
    res.status(NOT_FOUND).json({ status: ERROR, code: NOT_FOUND, message: NOT_FOUND_MSG });
});
app.use((err, req, res, next) => {
    res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: FAIL, code: INTERNAL_SERVER_ERROR, message: err.message });
});
exports.default = app;
