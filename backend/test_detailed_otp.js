// Detailed test to trace OTP sending process
import { initializePhoneAuth } from './services/otpService.js';

console.log('🔍 Starting detailed OTP send test...\n');

async function testDetailedOTP() {
  const phoneNumber = '7678417192';
  
  console.log(`📱 Testing OTP send for phone: ${phoneNumber}`);
  
  try {
    console.log('\n--- Calling initializePhoneAuth ---');
    const result = await initializePhoneAuth(phoneNumber);
    console.log('✅ OTP send process completed');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error in OTP send process:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testDetailedOTP();