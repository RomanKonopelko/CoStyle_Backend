const Joi = require("joi");
const mangoose = require("mongoose");

const schemaCreateTransaction = Joi.object({
  commentary: Joi.string().alphanum().min(0).max(50).required(),
});

const schemaCreateUser = Joi.object({
  name: Joi.string().alphanum().min(1).max(12).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(6).max(12).required(),
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
