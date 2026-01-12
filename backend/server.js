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

// Load env variables
dotenv.config();

// Init app
const app = express();
const PORT = process.env.PORT || 5001;

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ignore favicon error
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --------------------
// API ROUTES
// --------------------
console.log('🔄 Loading API routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes loaded');
app.use('/api/appointments', appointmentRoutes);
console.log('✅ Appointment routes loaded');
app.use('/api/reports', reportRoutes);
console.log('✅ Report routes loaded');
app.use('/api/referrals', referralRoutes);
console.log('✅ Referral routes loaded');
app.use('/api/profile', profileRoutes);
console.log('✅ Profile routes loaded');
app.use('/api', memberRoutes); // Member routes should be last to avoid catching other routes
console.log('✅ Member routes loaded');
// API test route (optional)
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Trustee Portal API running 🚀',
  });
});

// --------------------
// FRONTEND SERVE
// --------------------
const frontendPath = path.join(__dirname, '../dist');

app.use(express.static(frontendPath));

// React routing support
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --------------------
// ERROR HANDLING
// --------------------
app.use(notFound);
app.use(errorHandler);

// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('🌐 App URL:', `http://localhost:${PORT}`);
  console.log('🔗 API URL:', `http://localhost:${PORT}/api`);
});
