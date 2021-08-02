"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_WORK_FACTOR = 8;
const nanoid_1 = require("nanoid");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        default: "User",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate(value) {
            const re = /\S+@\S+\.\S+/g;
            return re.test(String(value).toLowerCase());
        },
    },
    balanceValue: {
        type: Number,
        default: 0,
    },
    token: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyToken: {
        type: String,
        required: true,
        default: nanoid_1.nanoid(),
    },
});
userSchema.methods.isValidPassword = async function (password) {
    return await bcryptjs_1.default.compare(password, this.password);
};
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcryptjs_1.default.genSalt(SALT_WORK_FACTOR);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
    }
    next();
});
const User = mongoose_1.model("user", userSchema);
exports.default = User;
