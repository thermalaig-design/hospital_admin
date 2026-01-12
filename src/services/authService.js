// authService.js - Frontend API calls
const API_URL = 'https://hospital-management-3-7z4c.onrender.com/api/auth';

export const checkPhoneNumber = async (phoneNumber) => {
  const response = await fetch(`${API_URL}/check-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });
  return await response.json();
};

// Removed OTP-related functions