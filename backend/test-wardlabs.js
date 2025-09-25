// Test script to debug Ward Labs API authentication
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.WARD_LABS_API_KEY;
const BASE_URL = process.env.WARD_LABS_BASE_URL;

console.log('🧪 Testing Ward Labs API Authentication');
console.log('📡 Base URL:', BASE_URL);
console.log('🔑 API Key (first 20 chars):', API_KEY ? API_KEY.substring(0, 20) + '...' : 'NOT SET');
console.log('');

const headerVariations = [
  { name: 'X-API-Key', value: API_KEY },
  { name: 'X-Api-Key', value: API_KEY },
  { name: 'x-api-key', value: API_KEY },
  { name: 'API-Key', value: API_KEY },
  { name: 'Api-Key', value: API_KEY },
  { name: 'api-key', value: API_KEY },
  { name: 'apikey', value: API_KEY },
  { name: 'Authorization', value: `Bearer ${API_KEY}` },
  { name: 'Authorization', value: `Api-Key ${API_KEY}` },
  { name: 'Authorization', value: `Token ${API_KEY}` },
];

async function testAuthentication() {
  for (const header of headerVariations) {
    try {
      console.log(`🔍 Testing header: ${header.name}`);
      
      const config = {
        method: 'get',
        url: `${BASE_URL}/samples`,
        headers: {
          'Content-Type': 'application/json',
          [header.name]: header.value
        },
        timeout: 5000
      };

      const response = await axios(config);
      
      console.log(`✅ SUCCESS with ${header.name}!`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(response.data, null, 2));
      return header;
      
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;
      
      if (status === 401) {
        console.log(`❌ ${header.name}: UNAUTHORIZED - ${message}`);
      } else if (status === 403) {
        console.log(`❌ ${header.name}: FORBIDDEN - ${message}`);
      } else if (status === 404) {
        console.log(`❌ ${header.name}: NOT FOUND - ${message}`);
      } else if (status && status >= 200 && status < 300) {
        console.log(`✅ ${header.name}: Success but different response`);
        console.log(`   Status: ${status}`);
        console.log(`   Response:`, JSON.stringify(error.response.data, null, 2));
      } else {
        console.log(`❓ ${header.name}: ${status || 'Network Error'} - ${message}`);
      }
    }
  }
  
  console.log('\n💡 None of the standard header formats worked.');
  console.log('📧 You should ask Ward Labs support for:');
  console.log('   1. The exact header name (case-sensitive)');
  console.log('   2. The exact format (Bearer, Api-Key, plain key, etc.)');
  console.log('   3. A sample cURL command that works');
}

testAuthentication().catch(console.error);
