import * as calculatorService from '../src/services/calculatorService.js';
import { describe, test, expect, beforeEach, vi } from 'vitest';


describe('Calculator Service - Unidade', () => {
  describe('Operações Básicas', () => {
    test('deve somar dois números corretamente', () => {
      expect(calculatorService.add(5, 3)).toBe(8);
    });

    test('deve subtrair dois números corretamente', () => {
      expect(calculatorService.subtract(10, 4)).toBe(6);
    });

    test('deve multiplicar dois números corretamente', () => {
      expect(calculatorService.multiply(3, 7)).toBe(21);
    });

    test('deve dividir dois números corretamente', () => {
      expect(calculatorService.divide(10, 2)).toBe(5);
    });

    test('deve lançar erro ao tentar dividir por zero', () => {
      expect(() => calculatorService.divide(10, 0)).toThrow('Divisão por zero não é permitida.');
    });

    test('deve calcular potência corretamente', () => {
      expect(calculatorService.power(2, 3)).toBe(8);
    });

    test('deve calcular raiz quadrada corretamente', () => {
      expect(calculatorService.sqrt(9)).toBe(3);
    });

    test('deve lançar erro ao tentar calcular raiz quadrada de número negativo', () => {
      expect(() => calculatorService.sqrt(-4)).toThrow('Não é possível calcular raiz quadrada de número negativo.');
    });

    test('deve calcular porcentagem corretamente', () => {
      expect(calculatorService.percentage(200, 15)).toBe(30);
    });
  });

  describe('Avaliação de Expressões Dinâmicas', () => {
    test('deve resolver expressões complexas com parênteses e frações', () => {
      // Exemplo: 2-5(1/3)(5+8) = 2 - 5*(1/3)*13 = 2 - 21.666... = -19.666...
      const result = calculatorService.evaluateExpression('2-5(1/3)(5+8)');
      expect(result).toBeCloseTo(-19.666666, 4);
    });

    test('deve lançar erro para expressão textual vazia ou não-string', () => {
      expect(() => calculatorService.evaluateExpression(null)).toThrow('Expressão inválida.');
    });

    test('deve lançar erro para sintaxe malformada', () => {
      expect(() => calculatorService.evaluateExpression('2 + * 5')).toThrow('Sintaxe da expressão matemática inválida.');
    });
  });

  describe('Execução por Nome de Operação (executeOperation)', () => {
    test('deve executar operação válida via mapa', () => {
      expect(calculatorService.executeOperation('multiply', 4, 5)).toBe(20);
    });

    test('deve lançar erro para operação desconhecida', () => {
      expect(() => calculatorService.executeOperation('modulo', 4, 2)).toThrow('Operação não suportada.');
    });

    test('deve lançar erro se os parâmetros forem inválidos', () => {
      expect(() => calculatorService.executeOperation('add', 'a', 2)).toThrow('Parâmetros numéricos inválidos.');
    });
  });
});