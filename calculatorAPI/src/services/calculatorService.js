import { evaluate } from 'mathjs';

export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => {
  if (b === 0) throw new Error('Divisão por zero não é permitida.');
  return a / b;
};
export const power = (a, b) => Math.pow(a, b);
export const sqrt = (a) => {
  if (a < 0) throw new Error('Não é possível calcular raiz quadrada de número negativo.');
  return Math.sqrt(a);
};
export const percentage = (a, b) => (a * b) / 100;

// Avalia expressões matemáticas em formato textual (ex: "2-5(1/3)(5+8)")
export const evaluateExpression = (expression) => {
  if (!expression || typeof expression !== 'string') {
    throw new Error('Expressão inválida.');
  }

  try {
    const result = evaluate(expression);

    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Resultado indeterminado ou inválido.');
    }

    return result;
  } catch (error) {
    throw new Error('Sintaxe da expressão matemática inválida.');
  }
};

//mapeamento para execução dinamica
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
    throw new Error('Operação não suportada.');
  }

  if (typeof a !== 'number' || (operation !== 'sqrt' && typeof b !== 'number')) {
    throw new Error('Parâmetros numéricos inválidos.');
  }

  return operation === 'sqrt' ? serviceFunc(a) : serviceFunc(a, b);
};