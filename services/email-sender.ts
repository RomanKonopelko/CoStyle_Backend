import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { IMessage } from "../helpers/interfaces/interfaces";
dotenv.config();

const { EMAIL_PASSWORD, EMAIL_LOGIN } = process.env;

class CreateSenderNodemailer {
  async send(msg: IMessage) {
    const config = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_LOGIN,
        pass: EMAIL_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    return transporter.sendMail({ ...msg, from: `CoStyle Studio <${EMAIL_LOGIN}>` });
  }
}

export default CreateSenderNodemailer;
