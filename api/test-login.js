import fetch from 'node-fetch';

// Test credentials
const email = 'dummy@example.com';
const password = 'password123';

async function testLogin() {
  console.log('Testing login with:', { email, password });
  
  try {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('Login successful!');
      console.log('Token:', data.token.substring(0, 20) + '...');
    } else {
      console.log('Login failed!');
    }
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

async function testDebugLogin() {
  console.log('Testing debug login with:', { email, password });
  
  try {
    const response = await fetch('http://localhost:5001/api/auth/login-debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('Debug login request successful!');
    } else {
      console.log('Debug login request failed!');
    }
  } catch (error) {
    console.error('Error testing debug login:', error);
  }
}

// Run both tests
async function runTests() {
  await testLogin();
  console.log('\n-----------------------\n');
  await testDebugLogin();
}

runTests(); 