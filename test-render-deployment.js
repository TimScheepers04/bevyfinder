#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Get the URL from command line argument or use default
const url = process.argv[2] || 'https://bevyfinder-api.onrender.com';

console.log('🔍 Testing Render deployment...');
console.log(`📍 Testing URL: ${url}`);

function testEndpoint(baseUrl, endpoint = '/health') {
    return new Promise((resolve, reject) => {
        const fullUrl = `${baseUrl}${endpoint}`;
        const client = fullUrl.startsWith('https') ? https : http;
        
        const req = client.get(fullUrl, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        data: jsonData,
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data,
                        headers: res.headers
                    });
                }
            });
        });
        
        req.on('error', (err) => {
            reject(err);
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function runTests() {
    try {
        console.log('\n1️⃣ Testing health endpoint...');
        const healthResult = await testEndpoint(url, '/health');
        console.log('✅ Health check passed!');
        console.log('📊 Response:', JSON.stringify(healthResult.data, null, 2));
        
        console.log('\n2️⃣ Testing API routes...');
        const apiResult = await testEndpoint(url, '/api/auth');
        console.log('✅ API routes accessible!');
        console.log('📊 Status:', apiResult.status);
        
        console.log('\n🎉 Deployment test completed successfully!');
        console.log(`🌐 Your API is running at: ${url}`);
        console.log('\n📱 Next steps:');
        console.log('1. Update the API URL in your frontend');
        console.log('2. Deploy the frontend to Netlify');
        console.log('3. Test the full application');
        
    } catch (error) {
        console.error('❌ Deployment test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check if your Render service is deployed');
        console.log('2. Verify environment variables are set correctly');
        console.log('3. Check the Render deployment logs');
        console.log('4. Make sure the URL is correct');
    }
}

runTests(); 