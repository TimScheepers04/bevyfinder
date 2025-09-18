// Quick fix for API URL - run this in browser console
console.log('🔧 Fixing API URL...');

// Override the API_BASE_URL
window.API_BASE_URL = 'https://bevyfinder.onrender.com/api';

console.log('✅ API URL fixed to:', window.API_BASE_URL);

// Test the API
fetch('https://bevyfinder.onrender.com/api/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API test successful:', data);
    alert('API fixed! You can now sign in.');
  })
  .catch(error => {
    console.error('❌ API test failed:', error);
    alert('API test failed: ' + error.message);
  });

