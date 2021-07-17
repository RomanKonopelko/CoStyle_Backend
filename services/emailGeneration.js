const Mailgen = require("mailgen");
require("dotenv").config();

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = "http://localhost:3000";
        break;

      case "production":
        this.link = "link for production";
        break;

      default:
        this.link = "http://localhost:3000";
        break;
    }
  }
  #createTemplateVerificationEmail(verifyToken, name) {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "CoStyle Studio",
        link: this.link, //better use ngrok service
      },
    });
    const email = {
      body: {
        name,
        intro: "Welcome to Lama Wallet",
        action: {
          instructions: "To be able to send all your money to our Lama wallet please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${this.link}/api/users/verify${verifyToken}`, //change localhost link to ingrok wrapper to avoid Spam warning
          },
        },
        outro: "Need help, or have questions? Please do not hesitate and just reply to this email!",
      },
    };
    return mailGenerator.generate(email);
  }
  async sendVerifyEmail(verifyToken, email, name) {
    const emailHtml = this.#createTemplateVerificationEmail(verifyToken, name);
    const msg = {
      to: email,
      subject: "Verify your account",
      html: emailHtml,
    };
    const result = await this.sender.send(msg);
    console.log(result);
  }
}

module.exports = EmailService;
