const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        user: "romankstudio@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    return transporter.sendMail({ ...msg, from: "CoStyle Studio <romank761@gmail.com>" });
  }
}

module.exports = {
  CreateSenderNodemailer,
};
