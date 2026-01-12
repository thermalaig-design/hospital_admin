import { initializePhoneAuth } from '../services/otpService.js';

/**
 * Check if phone number exists in system (before sending OTP)
 */
export const checkPhone = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    
    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Clean and validate phone format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }
    
    console.log(`📱 Checking phone: ${cleanPhone}`);
    
    const result = await initializePhoneAuth(cleanPhone);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    res.status(200).json({
      success: true,
      message: 'Phone number verified in database',
      data: {
        phoneNumber: result.data.phoneNumber,
        user: result.data.user
      }
    });
    
  } catch (error) {
    console.error('Error in checkPhone:', error);
    next(error);
  }
};