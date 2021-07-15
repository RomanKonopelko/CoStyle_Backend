const TRANSACTION_CATEGORIES = {
  main: {
    title: "Основные",
    color: "rgba(254, 208, 87, 1)",
  },
  leisure: {
    title: "Досуг",
    color: "rgba(36, 204, 167, 1)",
  },
  food: { title: "Еда", color: "rgba(255, 216, 208, 1)" },
  car: { title: "Машина", color: "rgba(253, 148, 152, 1)" },
  development: { title: "Развитие", color: "rgba(197, 186, 255, 1)" },
  education: { title: "Образование", color: "rgba(129, 225, 255, 1)" },
  children: { title: "Дети", color: "rgba(110, 120, 232, 1)" },
  house: { title: "Дом", color: "rgba(74, 86, 226, 1)" },
  stableIncome: { title: "Регулярный доход", color: "rgba(110, 120, 232, 1)" },
  unstableIncome: { title: "Нерегулярный доход", color: "rgba(74, 86, 226, 1)" },
  other: { title: "Другое", color: "rgba(0, 173, 132, 1)" },
};

const TRANSACTION_SORTS = {
  income: "Доход",
  consuption: "Расход",
};

const RATE_LIMIT = 10000;

const HTTP_CODES = {
  OK: 200,
  NOT_FOUND: 404,
  NO_CONTENT: 204,
  INTERNAL_SERVER_ERROR: 500,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
};

const HTTP_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid credentials",
  ERROR: "Error",
  FAIL: "Fail",
  NOT_FOUND_MSG: "Not found",
  SUCCESS: "Success",
  BLACKLISTED_TOKEN: "Token is located in blacklist!",
  INVALID_REQUEST: "Invalid request. Token is not valid",
  INVALID_SESSION: "Your session is not valid!",
  MISSING_FIELDS: "Missing required fields",
  EMAIL_IS_USED: "This email is already in use!",
  TOO_MANY_REQUESTS_MSG: "Too many requests. Please, try again later!",
  TRANSACTION_CREATED: "Transaction has been created!",
};

const APIlimiter = {
  windowsMs: 15 * 60 * 1000,
  max: 1000,
  handler: (req, res, next) => {
    return res.status(HTTP_CODES.UNAUTHORIZED).json({
      status: HTTP_MESSAGES.ERROR,
      code: HTTP_CODES.TOO_MANY_REQUESTS,
      message: HTTP_MESSAGES.TOO_MANY_REQUESTS_MSG,
    });
  },
};

module.exports = {
  TRANSACTION_SORTS,
  TRANSACTION_CATEGORIES,
  HTTP_MESSAGES,
  HTTP_CODES,
  RATE_LIMIT,
  APIlimiter,
};
