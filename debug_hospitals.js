// Debug script to test the hospitals API from the frontend perspective
import axios from 'axios';

// Test the hospitals API endpoint
async function testHospitalsAPI() {
  console.log('Testing hospitals API endpoint...');
  
  try {
    // Test with the same configuration as the frontend
    const response = await axios.get('https://hospital-management-q8yq.onrender.com/api/hospitals', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ API call successful!');
    console.log('Status:', response.status);
    console.log('Data count:', response.data.count);
    console.log('Has data:', Array.isArray(response.data.data));
    console.log('Sample hospital:', response.data.data[0]?.hospital_name || response.data.data[0]?.Name);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\nFirst hospital details:');
      console.log('- Name:', response.data.data[0].Name);
      console.log('- Hospital Name:', response.data.data[0].hospital_name);
      console.log('- Type:', response.data.data[0].type);
      console.log('- City:', response.data.data[0].city);
      console.log('- S. No.:', response.data.data[0]['S. No.']);
    }
    
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    }
    console.error('Full error:', error);
  }
}

testHospitalsAPI();