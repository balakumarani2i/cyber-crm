import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import dealRoutes from './routes/deals';
import taskRoutes from './routes/tasks';
import interactionRoutes from './routes/interactions';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'https://cyber-crm-pi.vercel.app',
    'https://cyber-crm-service.onrender.com'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/interactions', interactionRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;