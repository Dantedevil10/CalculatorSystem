import { Router } from 'express';
import { handleCalculate } from '../controllers/calculatorController.js';

const router = Router();

// Generic POST /api/calculate route
// Example body: { "operation": "add", "a": 10, "b": 5 }
router.post('/calculate', handleCalculate);

export default router;