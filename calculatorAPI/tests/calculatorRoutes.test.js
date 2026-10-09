import request from 'supertest';
import { app } from '../src/index.js';
import { describe, test, expect, beforeEach, vi } from 'vitest';

describe('Calculator API - Integração (Routes + Controller + Service)', () => {
  test('GET /health deve responder com status 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('POST /api/calculate - deve calcular expressão dinâmica com sucesso', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ expression: '2-5(1/3)(5+8)' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toBeCloseTo(-19.666666, 4);
  });

  test('POST /api/calculate - deve calcular operação nomeada com sucesso', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'power', a: 2, b: 4 });

    expect(response.status).toBe(200);
    expect(response.body.result).toBe(16);
  });

  test('POST /api/calculate - deve retornar erro 400 para divisão por zero', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'divide', a: 10, b: 0 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Divisão por zero não é permitida.' });
  });

  test('POST /api/calculate - deve retornar erro 400 para sintaxe inválida em expressão', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ expression: '5 ++ * 2' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Sintaxe da expressão matemática inválida.' });
  });
});