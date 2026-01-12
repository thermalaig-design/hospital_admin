import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';

import appointmentRoutes from './routes/appointmentRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import memberRoutes from './routes/memberRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// --------------------
// HEALTH CHECK ROUTES
// --------------------
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management Backend API running 🚀',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      members: '/api/members',
      appointments: '/api/appointments',
      reports: '/api/reports',
      referrals: '/api/referrals',
      profile: '/api/profile'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      members: '/api/members',
      appointments: '/api/appointments',
      reports: '/api/reports',
      referrals: '/api/referrals',
      profile: '/api/profile'
    }
  });
});

// --------------------
// API ROUTES
// --------------------
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', memberRoutes); // Member routes last to avoid catching other routes

// --------------------
// ERROR HANDLING
// --------------------
app.use(notFound);
app.use(errorHandler);

// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => {
  console.log('🚀 Server is running on port', PORT);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/`);
  console.log('🌐 Production URL:', `https://hospital-management-3-7z4c.onrender.com`);
});