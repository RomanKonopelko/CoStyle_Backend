const GET_CATEGORY_COLOR = function (arr, category) {
  if (!category) return null;
  const color = arr.find((e) => e[1].title === category)[1].color;
  return color;
};

const GET_INCOME_AMOUNT = function (arr) {
  const incomeArr = arr.filter((e) => e.sort === "Доход").map((e) => e.amount);
  const summaryValue = incomeArr.reduce((acc, value) => acc + value, 0);
  return summaryValue;
};

const GET_CONSUMPTION_AMOUNT = function (arr) {
  const consumptionArr = arr.filter((e) => e.sort === "Расход").map((e) => e.amount);
  const summaryValue = consumptionArr.reduce((acc, value) => acc + value, 0);
  return summaryValue;
};

const GET_CATEGORY_AMOUNT = function (arr, categories) {
  const incomeArr = arr.filter((e) => e.sort === "Расход");
  const amountObj = incomeArr.reduce((acc, value) => {
    return (
      acc[value.category]
        ? (acc[value.category] = {
            value: (acc[value.category].value += value.amount),
            color: acc[value.category].color,
          })
        : (acc[value.category] = {
            value: value.amount,
            color: categories.find((e) => (e[1].title === value.category ? e[1].color : null))[1]
              .color,
          }),
      acc
    );
  }, {});
  return amountObj;
};

const GET_BALANCE_AMOUNT = function (sort, amount, balance) {
  balance = sort === "Доход" ? (balance += amount) : (balance -= amount);
  return { balance };
};

const TO_CONVERT_TIME = function (time) {
  const [year, month, day] = time.split("-").map(Number);
  return {
    time: {
      date: new Date(year, month - 1, day),
      month: month + "",
      year: year + "",
    },
  };
};

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

module.exports = {
  GET_INCOME_AMOUNT,
  GET_CONSUMPTION_AMOUNT,
  GET_CATEGORY_AMOUNT,
  TRANSACTION_SORTS,
  TRANSACTION_CATEGORIES,
  HTTP_MESSAGES,
  HTTP_CODES,
  GET_CATEGORY_COLOR,
  GET_BALANCE_AMOUNT,
  TO_CONVERT_TIME,
};
