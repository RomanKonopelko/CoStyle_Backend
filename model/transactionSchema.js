"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../helpers/constants");
const CATEGORIES = Object.entries(constants_1.TRANSACTION_CATEGORIES);
const CATEGORIES_ARRAY = CATEGORIES.map((e) => e[1].title);
const SORTS = Object.values(constants_1.TRANSACTION_SORTS);
const transactionSchema = new mongoose_1.Schema({
    category: {
        type: String,
        enum: CATEGORIES_ARRAY,
    },
    time: {
        type: Object,
        required: [true, "Time is required"],
    },
    color: {
        type: String,
    },
    balance: {
        type: Number,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    sort: {
        type: String,
        required: true,
        enum: SORTS,
    },
    commentary: {
        type: String,
    },
    owner: { type: mongoose_1.SchemaTypes.ObjectId, ref: "user" },
    createdAt: Number,
    updatedAt: Number,
}, {
    versionKey: false,
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            return ret;
        },
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            return ret;
        },
    },
});
transactionSchema.plugin(mongoose_paginate_v2_1.default);
const Transaction = mongoose_1.model("transaction", transactionSchema);
exports.default = Transaction;
