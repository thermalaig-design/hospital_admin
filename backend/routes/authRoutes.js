import express from 'express';
import { checkPhone } from '../controllers/authController.js';

const router = express.Router();

// Check if phone number exists in system
router.post('/check-phone', checkPhone);

export default router;