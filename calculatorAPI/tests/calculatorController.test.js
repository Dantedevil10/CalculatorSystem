import { handleCalculate } from '../src/controllers/calculatorController.js';
import * as calculatorService from '../src/services/calculatorService.js';
import { describe, test, expect, beforeEach, vi } from 'vitest';

vi.mock('../src/services/calculatorService.js');

describe('Calculator Controller - Unidade', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  test('deve retornar 200 e o resultado para uma expressão válida', () => {
    req.body = { expression: '10 + 5' };
    calculatorService.evaluateExpression.mockReturnValue(15);

    handleCalculate(req, res);

    expect(calculatorService.evaluateExpression).toHaveBeenCalledWith('10 + 5');
    expect(res.json).toHaveBeenCalledWith({ expression: '10 + 5', result: 15 });
  });

  test('deve retornar 200 e o resultado para uma operação de objeto válida', () => {
    req.body = { operation: 'add', a: 10, b: 5 };
    calculatorService.executeOperation.mockReturnValue(15);

    handleCalculate(req, res);

    expect(calculatorService.executeOperation).toHaveBeenCalledWith('add', 10, 5);
    expect(res.json).toHaveBeenCalledWith({ operation: 'add', a: 10, b: 5, result: 15 });
  });

  test('deve retornar status 400 se nenhum dado válido for enviado', () => {
    req.body = {};

    handleCalculate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Informe uma expressão ou uma operação válida.' });
  });

  test('deve capturar erro lançado pelo service e retornar status 400', () => {
    req.body = { expression: '10 / 0' };
    calculatorService.evaluateExpression.mockImplementation(() => {
      throw new Error('Divisão por zero não é permitida.');
    });

    handleCalculate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Divisão por zero não é permitida.' });
  });
});