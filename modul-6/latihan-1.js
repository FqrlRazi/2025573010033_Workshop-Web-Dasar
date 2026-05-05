const display = document.getElementById("display");
const buttonContainer = document.getElementById("buttonContainer");

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

let displayValue = "0";
let expression = "";
let isCalculated = false;

// =======================
// UPDATE DISPLAY
// =======================
const updateDisplay = () => {
  display.textContent = expression || displayValue;
};

// =======================
// INPUT DIGIT
// =======================
const inputDigit = (digit) => {
  if (isCalculated) {
    displayValue = digit;
    expression = digit;
    isCalculated = false;
    return;
  }

  if (waitingForSecondValue) {
    displayValue = digit;
    waitingForSecondValue = false;
    expression += digit;
  } else {
    displayValue = displayValue === "0" ? digit : displayValue + digit;
    expression = expression === "" ? displayValue : expression + digit;
  }
};

// =======================
// INPUT DECIMAL
// =======================
const inputDecimal = () => {
  if (isCalculated) {
    displayValue = "0.";
    expression = "0.";
    isCalculated = false;
    return;
  }

  if (waitingForSecondValue) {
    displayValue = "0.";
    waitingForSecondValue = false;
    expression += "0.";
    return;
  }

  if (!displayValue.includes(".")) {
    displayValue += ".";
    expression += ".";
  }
};

// =======================
// CLEAR
// =======================
const clearAll = () => {
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
  displayValue = "0";
  expression = "";
  isCalculated = false;
};

// =======================
// REMOVE / BACKSPACE
// =======================
const removeLast = () => {
  if (isCalculated) {
    clearAll();
    return;
  }

  if (expression.length === 0) return;

  // jika terakhir operator (" + ")
  if (expression.endsWith(" ")) {
    expression = expression.slice(0, -3);
    operator = null;
    waitingForSecondValue = false;
  } else {
    expression = expression.slice(0, -1);
  }

  // ambil angka terakhir
  const parts = expression.split(/[\+\-\*\/]/);
  let lastPart = parts[parts.length - 1].trim();

  if (lastPart === "") {
    displayValue = "0";
    waitingForSecondValue = true;
  } else {
    displayValue = lastPart;
  }

  if (expression === "") {
    displayValue = "0";
    firstValue = null;
    operator = null;
  }
};

// =======================
// CALCULATION
// =======================
const calculate = (first, second, operator) => {
  const a = parseFloat(first);
  const b = parseFloat(second);

  if (Number.isNaN(a) || Number.isNaN(b)) return "0";

  switch (operator) {
    case "+":
      return String(a + b);
    case "-":
      return String(a - b);
    case "*":
      return String(a * b);
    case "/":
      return b === 0 ? "Tidak bisa dibagi 0" : String(a / b);
    default:
      return second;
  }
};

// =======================
// OPERATOR
// =======================
const handleOperator = (nextOperator) => {
  if (isCalculated) {
    firstValue = displayValue;
    operator = nextOperator;
    expression = displayValue + " " + nextOperator + " ";
    waitingForSecondValue = true;
    isCalculated = false;
    return;
  }

  if (operator && waitingForSecondValue) {
    operator = nextOperator;
    expression = expression.slice(0, -3) + " " + nextOperator + " ";
    return;
  }

  if (firstValue === null) {
    firstValue = displayValue;
  } else if (operator && !waitingForSecondValue) {
    const result = calculate(firstValue, displayValue, operator);
    firstValue = result;
    displayValue = result;
    expression = result + " " + nextOperator + " ";
    operator = nextOperator;
    waitingForSecondValue = true;
    return;
  }

  operator = nextOperator;
  waitingForSecondValue = true;
  expression += " " + nextOperator + " ";
};

// =======================
// BUTTON CLICK
// =======================
buttonContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  switch (action) {
    case "digit":
      inputDigit(value);
      break;

    case "decimal":
      inputDecimal();
      break;

    case "clear":
      clearAll();
      break;

    case "delete":
      removeLast();
      break;

    case "operator":
      handleOperator(value);
      break;

    case "calculate":
      if (operator && !waitingForSecondValue) {
        const result = calculate(firstValue, displayValue, operator);

        expression = expression + " = " + result;
        displayValue = result;

        operator = null;
        firstValue = null;
        waitingForSecondValue = false;
        isCalculated = true;
      }
      break;
  }

  updateDisplay();
});

// =======================
// KEYBOARD SUPPORT
// =======================
window.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
    updateDisplay();
    return;
  }

  if (key === ".") {
    inputDecimal();
    updateDisplay();
    return;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    handleOperator(key);
    updateDisplay();
    return;
  }

  if (key === "Backspace") {
    removeLast();
    updateDisplay();
    return;
  }

  if (key === "Enter") {
    event.preventDefault();

    if (operator && !waitingForSecondValue) {
      const result = calculate(firstValue, displayValue, operator);

      expression = expression + " = " + result;
      displayValue = result;

      operator = null;
      firstValue = null;
      waitingForSecondValue = false;
      isCalculated = true;

      updateDisplay();
    }
    return;
  }

  if (key === "Escape") {
    clearAll();
    updateDisplay();
  }
});

// =======================
updateDisplay();