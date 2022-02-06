"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { EMAIL_PASSWORD, EMAIL_LOGIN } = process.env;
class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_LOGIN,
        pass: EMAIL_PASSWORD,
      },
    };
    const transporter = nodemailer_1.default.createTransport(config);
    return transporter.sendMail({ ...msg, from: `CoStyle Studio <${EMAIL_LOGIN}>` });
  }
}
exports.default = CreateSenderNodemailer;
