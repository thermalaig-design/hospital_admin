// Test the frontend API function directly
import { getAllHospitals } from './src/services/api.js';

console.log('Testing frontend hospitals API function...');

async function testFrontendAPI() {
  try {
    console.log('Calling getAllHospitals()...');
    const result = await getAllHospitals();
    console.log('✅ Success! Received hospitals data:');
    console.log('Count:', result.count);
    console.log('Sample hospital:', result.data[0]?.hospital_name);
  } catch (error) {
    console.log('❌ Error in frontend API call:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

testFrontendAPI();