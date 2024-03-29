import Mailgen from "mailgen";
import dotenv from "dotenv";
import CreateSenderNodemailer from "./email-sender";
dotenv.config();

const { DEVELOPE_URL, PRODUCTION_URL } = process.env;

class EmailService {
  sender: any;
  link?: string;
  constructor(env: string | undefined, sender: CreateSenderNodemailer) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = DEVELOPE_URL;
        break;

      case "production":
        this.link = PRODUCTION_URL;
        break;

      default:
        this.link = DEVELOPE_URL;
        break;
    }
  }
  #createTemplateVerificationEmail(verifyToken: string, name: string) {
    const mailGenerator = new Mailgen({
      theme: "neopolitan",
      product: {
        name: "CoStyle Studio",
        link: this.link!,
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
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
        outro: "Need help, or have questions? Please do not hesitate and just reply to this email!",
      },
    };
    return mailGenerator.generate(email);
  }
  async sendVerifyEmail(verifyToken: string, email: string, name: string) {
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
export default EmailService;
