import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import swapRoutes from './routes/swapRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', swapRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
