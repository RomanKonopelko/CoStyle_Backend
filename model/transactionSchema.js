const { Schema, model, SchemaTypes } = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");
const { TRANSACTION_CATEGORIES, TRANSACTION_SORTS } = require("../helpers/constants");

const CATEGORIES = Object.values(TRANSACTION_CATEGORIES);
const SORTS = Object.values(TRANSACTION_SORTS);

const transactionSchema = new Schema(
  {
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    time: {
      type: String,
      required: true,
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
  },
  {
    versionKey: false,
    timestamps: true,
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

transactionSchema.virtual("info").get(function () {
  return `This is transactions of ${this.name}`;
});

// transactionSchemaSchema.plugin(mongoosePaginate);

const Transaction = model("transaction", transactionSchema);

module.exports = Transaction;
