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
  color(): (a: ICategory[], b: string) => string;
  balance: number;
  amount: number;
  sort: ESort;
  commentary: string;
}

interface ITransaction {
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
}

interface ITransactionValue {
  [key: string]: {
    value: number;
    color: string;
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
};
