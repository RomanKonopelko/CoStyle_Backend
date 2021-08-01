import { Schema, model, SchemaTypes } from "mongoose";
import { ICategory, ITransactionSchema } from "../helpers/interfaces/interfaces";
import mongoosePaginate from "mongoose-paginate-v2";
import { TRANSACTION_CATEGORIES, TRANSACTION_SORTS } from "../helpers/constants";

const CATEGORIES: ICategory[] = Object.entries(TRANSACTION_CATEGORIES);
const CATEGORIES_ARRAY = CATEGORIES.map((e) => e[1].title);
const SORTS: string[] = Object.values(TRANSACTION_SORTS);

const transactionSchema = new Schema<ITransactionSchema>(
  {
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
    owner: { type: SchemaTypes.ObjectId, ref: "user" },
    createdAt: Number,
    updatedAt: Number,
  },
  {
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
  }
);

transactionSchema.plugin(mongoosePaginate);

const Transaction = model("transaction", transactionSchema);

export default Transaction;
