const User = require("../model/userSchema");

const findById = async (id) => await User.findById(id);

const findByEmail = async (email) => await User.findOne({ email });

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = { findByEmail, findById, create, updateToken };
