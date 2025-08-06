// Simple test script to verify error handling
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testErrorHandling() {
  console.log('🧪 Testing Backend Error Handling...\n');

  // Test 1: Invalid login
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: 'invalid@email.com',
      password: 'wrongpassword'
    });
  } catch (error) {
    console.log('✅ Invalid Login Test:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Success:', error.response?.data?.success);
    console.log('');
  }

  // Test 2: Validation error
  try {
    await axios.post(`${API_BASE}/auth/register`, {
      name: 'A', // Too short
      email: 'invalid-email', // Invalid format
      password: '123' // Too short
    });
  } catch (error) {
    console.log('✅ Validation Error Test:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Success:', error.response?.data?.success);
    console.log('');
  }

  // Test 3: 404 error
  try {
    await axios.get(`${API_BASE}/nonexistent-endpoint`);
  } catch (error) {
    console.log('✅ 404 Error Test:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Success:', error.response?.data?.success);
    console.log('');
  }

  // Test 4: Unauthorized access
  try {
    await axios.get(`${API_BASE}/customers`);
  } catch (error) {
    console.log('✅ Unauthorized Access Test:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Success:', error.response?.data?.success);
    console.log('');
  }

  console.log('🎉 Error handling tests completed!');
}

// Run tests if server is running
testErrorHandling().catch(err => {
  console.error('❌ Test failed:', err.message);
  console.log('Make sure the backend server is running on port 5000');
});