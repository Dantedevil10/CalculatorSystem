import * as calculatorService from '../services/calculatorService.js';

export const handleCalculate = (req, res) => {
  try {
    const { expression, operation, a, b } = req.body;

    // If the client sent a dynamic expression
    if (expression) {
      const result = calculatorService.evaluateExpression(expression);
      return res.json({ expression, result });
    }

    // If a structured operation (add, subtract, etc.) was sent
    if (operation) {
      const result = calculatorService.executeOperation(operation, Number(a), Number(b));
      return res.json({ operation, a, b, result });
    }

    return res.status(400).json({ error: 'Enter a valid expression or operation.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};