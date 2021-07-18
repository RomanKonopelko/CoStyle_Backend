const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 8;
const { nanoid } = require("nanoid");

const userSchema = new Schema({
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
  verify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: true,
    default: nanoid(),
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
