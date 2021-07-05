const { Schema, model } = require("mongoose");
const { SUBSCRIPTIONS } = require("../helpers/constants");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 8;

const SubscriptionValues = Object.values(SUBSCRIPTIONS);

console.log(SubscriptionValues);

const userSchema = new Schema({
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
  token: {
    type: String,
    default: null,
  },
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = model("user", userSchema);

module.exports = User;
