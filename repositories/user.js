const User = require("../model/userSchema");

const findById = async (id) => await User.findById(id);

const findByEmail = async (email) => await User.findOne({ email });

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateBalance = async (id, { balance }) => {
  return await User.updateOne({ _id: id }, { balanceValue: balance });
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateVerifyToken = async (id, isVerified, verifyToken) => {
  return await User.updateOne({ _id: id }, { isVerified, verifyToken });
};

const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateBalance,
  updateVerifyToken,
  findByVerifyToken,
};
