import fetch from 'node-fetch';

const API_URL = 'http://localhost:5001/api/auth/login';
const user = {
  email: 'dummy@example.com',
  password: 'password123'
};

async function testLogin() {
  console.log('Testing login with credentials:', user);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('Login successful! Token:', data.token.substring(0, 20) + '...');
      console.log('User details:', data.user);
    } else {
      console.log('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

testLogin(); 