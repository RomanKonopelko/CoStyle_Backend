"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _EmailService_instances, _EmailService_createTemplateVerificationEmail;
Object.defineProperty(exports, "__esModule", { value: true });
const mailgen_1 = __importDefault(require("mailgen"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DEVELOPE_URL, PRODUCTION_URL } = process.env;
class EmailService {
    constructor(env, sender) {
        _EmailService_instances.add(this);
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
    async sendVerifyEmail(verifyToken, email, name) {
        const emailHtml = __classPrivateFieldGet(this, _EmailService_instances, "m", _EmailService_createTemplateVerificationEmail).call(this, verifyToken, name);
        const msg = {
            to: email,
            subject: "Verify your account",
            html: emailHtml,
        };
        const result = await this.sender.send(msg);
        console.log(result);
    }
}
_EmailService_instances = new WeakSet(), _EmailService_createTemplateVerificationEmail = function _EmailService_createTemplateVerificationEmail(verifyToken, name) {
    const mailGenerator = new mailgen_1.default({
        theme: "neopolitan",
        product: {
            name: "CoStyle Studio",
            link: this.link,
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
};
exports.default = EmailService;
