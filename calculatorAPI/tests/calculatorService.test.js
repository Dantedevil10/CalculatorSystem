import * as calculatorService from '../src/services/calculatorService.js';
import { describe, test, expect, beforeEach, vi } from 'vitest';


describe('Calculator Service - Unidade', () => {
  describe('Basic Operations', () => {
    test('must add two numbers correctly', () => {
      expect(calculatorService.add(5, 3)).toBe(8);
    });

    test('must subtract two numbers correctly', () => {
      expect(calculatorService.subtract(10, 4)).toBe(6);
    });

    test('must multiply two numbers correctly', () => {
      expect(calculatorService.multiply(3, 7)).toBe(21);
    });

    test('must divide two numbers correctly', () => {
      expect(calculatorService.divide(10, 2)).toBe(5);
    });

    test('should throw an error when attempting to divide by zero', () => {
      expect(() => calculatorService.divide(10, 0)).toThrow('Division by zero is not allowed.');
    });

    test('must calculate power correctly', () => {
      expect(calculatorService.power(2, 3)).toBe(8);
    });

    test('must calculate the square root correctly', () => {
      expect(calculatorService.sqrt(9)).toBe(3);
    });

    test('should throw an error when attempting to calculate the square root of a negative number', () => {
      expect(() => calculatorService.sqrt(-4)).toThrow('It is not possible to calculate the square root of a negative number.');
    });

    test('must calculate the percentage correctly', () => {
      expect(calculatorService.percentage(200, 15)).toBe(30);
    });
  });

  describe('Dynamic Expression Evaluation', () => {
    test('must solve complex expressions involving parentheses and fractions', () => {
      // Ex 2-5(1/3)(5+8) = 2 - 5*(1/3)*13 = 2 - 21.666... = -19.666...
      const result = calculatorService.evaluateExpression('2-5(1/3)(5+8)');
      expect(result).toBeCloseTo(-19.666666, 4);
    });

    test('must throw an error for an empty or non-string text expression', () => {
      expect(() => calculatorService.evaluateExpression(null)).toThrow('Invalid expression.');
    });

    test('must throw an error for malformed syntax', () => {
      expect(() => calculatorService.evaluateExpression('2 + * 5')).toThrow('Invalid mathematical expression syntax.');
    });
  });

  describe('Execution by Operation Name (executeOperation)', () => {
    test('must perform a valid operation via the map', () => {
      expect(calculatorService.executeOperation('multiply', 4, 5)).toBe(20);
    });

    test('must throw an error for an unknown operation', () => {
      expect(() => calculatorService.executeOperation('modulo', 4, 2)).toThrow('Operation not supported.');
    });

    test('should throw an error if the parameters are invalid', () => {
      expect(() => calculatorService.executeOperation('add', 'a', 2)).toThrow('Invalid numeric parameters.');
    });
  });
});