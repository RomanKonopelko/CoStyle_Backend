const Joi = require("joi");
const mangoose = require("mongoose");
const { JoiPasswordComplexity } = require("joi-password");

const schemaCreateTransaction = Joi.object({
  time: Joi.string().required(),
  amount: Joi.number().min(0).max(1000000).required(),
  sort: Joi.string().required(),
  category: Joi.string().when("sort", { is: "Расход", then: Joi.string().required() }),
  commentary: Joi.string().min(0).max(50),
});

const schemaCreateUser = Joi.object({
  name: Joi.string().alphanum().min(1).max(12).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: JoiPasswordComplexity.string()
    .min(6)
    .max(12)
    .minOfSpecialCharacters(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .required()
    .messages({
      "password.minOfUppercase": "Password must contain at least one of A-Z characters",
      "password.minOfSpecialCharacters":
        "Password must containt at least one of a special character",
      "password.minOfNumeric": "Password must contain at least one of 0-9",
    }),
});

const isIdValid = (id) => {
  return mangoose.isValidObjectId(id);
};

const toValidate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validatedNewTransaction: (req, res, next) => {
    return toValidate(schemaCreateTransaction, req.body, next);
  },
  validatedNewUser: (req, res, next) => {
    return toValidate(schemaCreateUser, req.body, next);
  },
};
