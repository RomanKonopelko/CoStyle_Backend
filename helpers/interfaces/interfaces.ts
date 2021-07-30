import { Request, Response, NextFunction } from "express";

interface ICategories {
  [key: string]: {
    title: string;
    color: string;
  };
}

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

export { ILimiter, IMessages, ICategories, ISorts, ICodes };
