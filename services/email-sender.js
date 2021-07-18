const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      service: "gmail",
      secure: true,
      auth: {
        user: "romankstudio@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    return transporter.sendMail({ ...msg, from: "CoStyle Studio <romankstudio@gmail.com>" });
  }
}

module.exports = CreateSenderNodemailer;
