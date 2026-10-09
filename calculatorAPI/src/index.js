import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import calculatorRoutes from './routes/calculatorRoutes.js';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health Check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is working!' });
});

// Grouping of routes under the /api prefix
app.use('/api', calculatorRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on Port:${PORT}`);
  });
}