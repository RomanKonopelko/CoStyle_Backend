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

module.exports = {
  GET_INCOME_AMOUNT,
  GET_CONSUMPTION_AMOUNT,
  GET_CATEGORY_AMOUNT,
  GET_CATEGORY_COLOR,
  GET_BALANCE_AMOUNT,
  TO_CONVERT_TIME,
};
