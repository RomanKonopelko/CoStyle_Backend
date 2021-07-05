const TRANSACTION_CATEGORIES = {
  main: "Основные",
  food: "Еда",
  car: "Машина",
  development: "Развитие",
  education: "Образование",
  children: "Дети",
  house: "Дом",
  other: "Другое",
};

const TRANSACTION_SORTS = {
  income: "доход",
  consuption: "расход",
};

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
  NOT_FOUND_MSG: "Not found",
  SUCCESS: "Success",
  DELETED: "deleted successfully!",
  MISSING_FIELDS: "Missing required fields",
  EMAIL_IS_USED: "This email is already in use!",
  TOO_MANY_REQUESTS_MSG: "Too many requests. Please, try again later!",
  TRANSACTION_CREATED: "Transaction has been created!",
};

module.exports = { TRANSACTION_SORTS, TRANSACTION_CATEGORIES, HTTP_MESSAGES, HTTP_CODES };
