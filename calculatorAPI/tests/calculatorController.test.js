import { describe, test, expect, beforeEach, vi } from 'vitest';
import { handleCalculate } from '../src/controllers/calculatorController.js';
import * as calculatorService from '../src/services/calculatorService.js';

vi.mock('../src/services/calculatorService.js');

describe('Calculator Controller - Unit', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  test('should return 200 and the result for a valid expression', () => {
    req.body = { expression: '10 + 5' };
    calculatorService.evaluateExpression.mockReturnValue(15);

    handleCalculate(req, res);

    expect(calculatorService.evaluateExpression).toHaveBeenCalledWith('10 + 5');
    expect(res.json).toHaveBeenCalledWith({ expression: '10 + 5', result: 15 });
  });

  test('should return 200 and the result for a valid object operation', () => {
    req.body = { operation: 'add', a: 10, b: 5 };
    calculatorService.executeOperation.mockReturnValue(15);

    handleCalculate(req, res);

    expect(calculatorService.executeOperation).toHaveBeenCalledWith('add', 10, 5);
    expect(res.json).toHaveBeenCalledWith({ operation: 'add', a: 10, b: 5, result: 15 });
  });

  test('should return a 400 status if no valid data is sent', () => {
    req.body = {};

    handleCalculate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Enter a valid expression or operation.' });
  });

  test('It must catch the error thrown by the service and return a 400 status.', () => {
    req.body = { expression: '10 / 0' };
    calculatorService.evaluateExpression.mockImplementation(() => {
      throw new Error('Division by zero is not allowed.');
    });

    handleCalculate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Division by zero is not allowed.' });
  });
});