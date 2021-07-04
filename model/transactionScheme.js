const { Schema, model, SchemaTypes } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { CATEGORY_VALUES } = require("../helpers/constants");

const CATEGORIES = Object.values(CATEGORY_VALUES);

const transactionSchema = new Schema(
  {
    category: {
      type: String,
      enum: CATEGORIES,
      default: null,
      required: true,
    },
    time: {
      type: String,
      required: true,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
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

transactionSchemaSchema.plugin(mongoosePaginate);

const Transaction = model("transaction", transactionScheme);

module.exports = Contact;
