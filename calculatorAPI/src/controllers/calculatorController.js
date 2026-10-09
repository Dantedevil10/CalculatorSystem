import * as calculatorService from '../services/calculatorService.js';

export const handleCalculate = (req, res) => {
  try {
    const { expression, operation, a, b } = req.body;

    // Se o cliente enviou uma expressão dinâmica
    if (expression) {
      const result = calculatorService.evaluateExpression(expression);
      return res.json({ expression, result });
    }

    // Se enviou operação estruturada (add, subtract, etc.)
    if (operation) {
      const result = calculatorService.executeOperation(operation, Number(a), Number(b));
      return res.json({ operation, a, b, result });
    }

    return res.status(400).json({ error: 'Informe uma expressão ou uma operação válida.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};