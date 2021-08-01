import { IUserBody } from "../helpers/interfaces/interfaces";

import User from "../model/userSchema";

const findById = async (id: string) => await User.findById(id);

const findByEmail = async (email: string) => await User.findOne({ email });

const create = async (body: IUserBody) => {
  const user = new User(body);
  return await user.save();
};

const updateBalance = async (id: string, balance: { balance: number }) => {
  return await User.updateOne({ _id: id }, { balanceValue: balance.balance });
};

const updateToken = async (id: string, token: string) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateVerifyToken = async (id: string, isVerified: boolean, verifyToken: string) => {
  return await User.updateOne({ _id: id }, { isVerified, verifyToken });
};

const findByVerifyToken = async (verifyToken: string) => {
  return await User.findOne({ verifyToken });
};

export {
  findByEmail,
  findById,
  create,
  updateToken,
  updateBalance,
  updateVerifyToken,
  findByVerifyToken,
};
