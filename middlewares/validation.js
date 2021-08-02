const Joi = require("joi");
const mangoose = require("mongoose");
const { JoiPasswordComplexity } = require("joi-password");
const { HTTP_CODES, HTTP_MESSAGES } = require("../helpers/constants");

const schemaCreateTransaction = Joi.object({
  time: Joi.string().required(),
  amount: Joi.number().min(0).max(1000000).required(),
  sort: Joi.string().required(),
  category: Joi.string().when("sort", { is: "Расход", then: Joi.string().required() }),
  commentary: Joi.string().trim().min(0).max(50),
});

const schemaUpdateTransaction = Joi.object({
  time: Joi.string().optional(),
  amount: Joi.number().min(0).max(1000000).optional(),
  sort: Joi.string().optional(),
  category: Joi.string().when("sort", { is: "Расход", then: Joi.string().optional() }),
  commentary: Joi.string().trim().min(0).max(50),
});

const schemaCreateUser = Joi.object({
  name: Joi.string()
    .trim()
    .alphanum()
    .min(1)
    .max(12)
    .required()
    .messages({ "string.alphanum": "Имя должно содержать только буквы и цифры!" }),
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: JoiPasswordComplexity.string().trim().min(6).max(12).required(),
});

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

const isIdValid = (id) => {
  return mangoose.isValidObjectId(id);
};

module.exports = {
  validatedNewTransaction: (req, res, next) => {
    return toValidate(schemaCreateTransaction, req.body, next);
  },
  validatedNewUser: (req, res, next) => {
    return toValidate(schemaCreateUser, req.body, next);
  },
  validatedTransactionId: (req, res, next) => {
    if (!isIdValid(req.params.transactionId)) {
      return next({
        status: 400,
        message: "invalid ID",
      });
    }
    next();
  },
  validatedUpdateTransaction: (req, res, next) => {
    return toValidate(schemaUpdateTransaction, req.body, next);
  },
};
