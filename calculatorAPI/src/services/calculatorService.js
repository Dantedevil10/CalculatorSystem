import { evaluate } from 'mathjs';

export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => {
  if (b === 0) throw new Error('Division by zero is not allowed.');
  return a / b;
};
export const power = (a, b) => Math.pow(a, b);
export const sqrt = (a) => {
  if (a < 0) throw new Error('It is not possible to calculate the square root of a negative number.');
  return Math.sqrt(a);
};
export const percentage = (a, b) => (a * b) / 100;

// Evaluates mathematical expressions in text format (ex: "2-5(1/3)(5+8)")
export const evaluateExpression = (expression) => {
  if (!expression || typeof expression !== 'string') {
    throw new Error('Invalid expression.');
  }

  try {
    const result = evaluate(expression);

    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Indeterminate or invalid result.');
    }

    return result;
  } catch (error) {
    throw new Error('Invalid mathematical expression syntax.');
  }
};

//mapping for dynamic execution
const operationsMap = {
  add,
  subtract,
  multiply,
  divide,
  power,
  sqrt,
  percentage,
};

export const executeOperation = (operation, a, b) => {
  const serviceFunc = operationsMap[operation];

  if (!serviceFunc) {
    throw new Error('Operation not supported.');
  }

  if (typeof a !== 'number' || (operation !== 'sqrt' && typeof b !== 'number')) {
    throw new Error('Invalid numeric parameters.');
  }

  return operation === 'sqrt' ? serviceFunc(a) : serviceFunc(a, b);
};