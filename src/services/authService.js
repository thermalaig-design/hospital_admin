// authService.js - Frontend API calls
const API_URL = 'http://localhost:5001/api/auth';

export const checkPhoneNumber = async (phoneNumber) => {
  const response = await fetch(`${API_URL}/check-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });
  return await response.json();
};

// Removed OTP-related functions