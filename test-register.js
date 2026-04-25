const axios = require('axios');

async function testRegister() {
  try {
    const res = await axios.post('http://localhost:8080/api/auth/register', {
      email: 'newdoc' + Date.now() + '@hospital.com',
      password: 'password123',
      role: 'doctor',
      profileData: {
        firstName: 'New',
        lastName: 'Doc',
        phone: '1234567890',
        specialization: 'Cardiology',
        licenseNumber: 'LIC-' + Date.now()
      }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Failed:', err.response ? err.response.data : err.message);
  }
}

testRegister();
