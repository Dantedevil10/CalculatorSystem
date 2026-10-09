import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import calculatorRoutes from './routes/calculatorRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is working!' });
});

// Agrupamento de rotas sob o prefixo /api
app.use('/api', calculatorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on Port:${PORT}`);
});