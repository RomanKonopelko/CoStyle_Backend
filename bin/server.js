"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../model/db"));
const PORT = process.env.PORT || 3000;
db_1.default.then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server running. Use our API on port: ${PORT}`);
    });
}).catch((err) => console.log(`Error ${err.message}`));
