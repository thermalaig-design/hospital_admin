import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler, notFound } from './middleware/errorHandler.js';
import adminRoutes from './routes/adminRoutes.js';

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

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite default port
    'http://localhost:3000', // React default port
    'http://localhost:3001', // Alternative React port
    'http://localhost:5000', // Alternative port
    'https://hospital-trustee-fiwe.vercel.app', // Production frontend
    'https://hospital-trustee-h3cv.vercel.app', // Alternative frontend
    'https://hospital-management-3-7z4c.onrender.com', // Old backend URL
    'https://hospital-trustee.vercel.app' // Alternative frontend
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// --------------------
// HEALTH CHECK ROUTES
// --------------------
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management Admin API running 🚀',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      admin: '/api/admin'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management Admin API',
    version: '1.0.0',
    endpoints: {
      admin: '/api/admin'
    }
  });
});

// --------------------
// API ROUTES
// --------------------
app.use('/api/admin', adminRoutes); // Admin routes

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
  console.log(`📍 API URL: https://hospital-trustee-fiwe.vercel.app/`);
  console.log(`📍 API URL: https://hospital-trustee-fiwe.vercel.app/api/auth`);
  console.log('🌐 Production URL:', `https://hospital-trustee-fiwe.vercel.app/`);
});