const { Schema, model, SchemaTypes } = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");
const {
  TRANSACTION_CATEGORIES,
  TRANSACTION_SORTS,
  GET_CATEGORY_COLOR,
} = require("../helpers/constants");

const CATEGORIES = Object.entries(TRANSACTION_CATEGORIES);
const CATEGORIES_ARRAY = CATEGORIES.map((e) => e[1].title);
const SORTS = Object.values(TRANSACTION_SORTS);

const transactionSchema = new Schema(
  {
    category: {
      type: String,
      enum: CATEGORIES_ARRAY,
    },
    time: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: function () {
        return GET_CATEGORY_COLOR(CATEGORIES, this.category);
      },
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

// transactionSchema.virtual("info").get(function () {
//   return `This is transactions of ${this.name}`;
// });

// transactionSchemaSchema.plugin(mongoosePaginate);

const Transaction = model("transaction", transactionSchema);

module.exports = Transaction;
