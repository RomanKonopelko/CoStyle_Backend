import { Request, Response, NextFunction } from "express";
import { Document } from "mongoose";

interface ICategories {
  [key: string]: {
    title: string;
    color: string;
  };
}

type ICategory = [string, { title: string; color: string }];

interface ISorts {
  income: string;
  consumption: string;
}

interface ICodes {
  [key: string]: number;
}

interface IMessages {
  [key: string]: string;
}

interface ILimiter {
  windowsMs: number;
  max: number;
  handler(req: Request, res: Response, next: NextFunction): void;
}

enum ESort {
  income = "Доход",
  consumption = "Расход",
}

interface IUserBody {
  password: string;
  email: string;
  name: string;
}

interface IUserData {
  isVerified: boolean;
  isValidPassword(data: any): Promise<boolean>;
  id: string;
  name: string;
  email: string;
}

interface IMessage {
  to: string;
  subject: string;
  html: string;
}

interface ITransactionSchema extends Document {
  category: {
    type: string;
    enum: string[];
  };
  time: {
    date: string;
    month: string;
    year: string;
  };
  color: string;
  balance: number;
  amount: number;
  sort: ESort;
  commentary: string;
}

interface ITransactionBody {
  category?: string;
  time?: string;
  amount?: number;
  sort?: string;
  commentary?: string;
  balance?: number;
}

interface ITransaction {
  id: string;
  category: string;
  time: {
    date: string;
    month: string;
    year: string;
  };
  balance: number;
  amount: number;
  sort: ESort;
  commentary: string;
  createdAt: number;
}

interface ITransactionValue {
  [key: string]: {
    value: number;
    color: string;
  };
}

interface IConvertedTime {
  time: {
    date: Date;
    month: string;
    year: string;
  };
}

interface IUser {
  user: {
    id: string;
  };
}

export {
  ILimiter,
  IMessages,
  ICategories,
  ISorts,
  ICodes,
  ICategory,
  ITransactionSchema,
  ITransaction,
  ITransactionValue,
  IUserBody,
  ITransactionBody,
  IConvertedTime,
  IUser,
  IUserData,
  IMessage,
};
