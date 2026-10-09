import request from 'supertest';
import { describe, test, expect } from 'vitest';
import { app } from '../src/index.js';

describe('Calculator API - Integration (Routes + Controller + Service)', () => {
  test('GET /health must respond with status 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('POST /api/calculate - must successfully evaluate a dynamic expression', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ expression: '2-5(1/3)(5+8)' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toBeCloseTo(-19.666666, 4);
  });

  test('POST /api/calculate - must successfully calculate the named operation', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'power', a: 2, b: 4 });

    expect(response.status).toBe(200);
    expect(response.body.result).toBe(16);
  });

  test('POST /api/calculate - should return a 400 error for division by zero', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'divide', a: 10, b: 0 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Division by zero is not allowed.' });
  });

  test('POST /api/calculate - should return a 400 error for invalid syntax in the expression', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ expression: '5 ++ * 2' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid mathematical expression syntax.' });
  });
});