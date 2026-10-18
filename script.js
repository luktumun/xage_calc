const ageForm = document.querySelector("#ageForm");
const fields = {
  day: document.querySelector("#dayIn"),
  month: document.querySelector("#monthIn"),
  year: document.querySelector("#yearIn"),
};
const outputs = {
  day: document.querySelector("#dayOut"),
  month: document.querySelector("#monthOut"),
  year: document.querySelector("#yearOut"),
};
const errors = {
  day: document.querySelector("#dayError"),
  month: document.querySelector("#monthError"),
  year: document.querySelector("#yearError"),
};

function setError(fieldName, message) {
  errors[fieldName].textContent = message;
  fields[fieldName].setAttribute("aria-invalid", String(Boolean(message)));
}

function daysInMonth(year, month) {
  if (month === 2) {
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return isLeapYear ? 29 : 28;
  }

  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function resetResults() {
  outputs.day.textContent = "--";
  outputs.month.textContent = "--";
  outputs.year.textContent = "--";
}

function validateField(name, value) {
  if (!value) {
    setError(name, "This field is required");
    return false;
  }

  const number = Number(value);
  const isNumeric = /^\d+$/.test(value);

  if (
    name === "day" &&
    (!isNumeric || number < 1 || number > 31)
  ) {
    setError(name, "Must be a valid day");
    return false;
  }

  if (
    name === "month" &&
    (!isNumeric || number < 1 || number > 12)
  ) {
    setError(name, "Must be a valid month");
    return false;
  }

  if (
    name === "year" &&
    (!isNumeric || number < 1 || value.length !== 4)
  ) {
    setError(name, "Must be a valid year");
    return false;
  }

  if (name === "year" && number > new Date().getFullYear()) {
    setError(name, "Must be in past");
    return false;
  }

  setError(name, "");
  return true;
}

function calculateAge(birthDate, today) {
  let years = today.year - birthDate.year;
  let months = today.month - birthDate.month;
  let days = today.day - birthDate.day;

  if (days < 0) {
    months -= 1;
    let previousMonth = today.month - 1;
    let previousMonthYear = today.year;

    if (previousMonth === 0) {
      previousMonth = 12;
      previousMonthYear -= 1;
    }

    days += daysInMonth(previousMonthYear, previousMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

ageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  resetResults();

  const values = {
    day: fields.day.value.trim(),
    month: fields.month.value.trim(),
    year: fields.year.value.trim(),
  };
  const day = Number(values.day);
  const month = Number(values.month);
  const year = Number(values.year);
  let isValid = true;
  for (const name of Object.keys(fields)) {
    if (!validateField(name, values[name])) isValid = false;
  }
  if (!isValid) return;

  if (day > daysInMonth(year, month)) {
    setError("day", "Must be a valid date");
    return;
  }

  const now = new Date();
  const today = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
  const isFutureDate =
    year > today.year ||
    (year === today.year &&
      (month > today.month || (month === today.month && day > today.day)));

  if (isFutureDate) {
    setError("year", "Must be in past");
    return;
  }

  const age = calculateAge({ year, month, day }, today);
  outputs.year.textContent = String(age.years);
  outputs.month.textContent = String(age.months);
  outputs.day.textContent = String(age.days);
});

for (const name of Object.keys(fields)) {
  fields[name].addEventListener("input", () => {
    const value = fields[name].value.trim();
    if (value || errors[name].textContent) {
      validateField(name, value);
    }
  });

  fields[name].addEventListener("blur", () => {
    validateField(name, fields[name].value.trim());
  });
}
