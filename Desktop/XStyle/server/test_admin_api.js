const axios = require('axios');

async function testAdmin() {
    try {
        console.log('Attempting Login...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@xstyle.com',
            password: '9450' // Assuming this from the PG password seen earlier or standard
        });
        
        const token = loginRes.data.token;
        console.log('Login successful! Getting users...');
        
        const usersRes = await axios.get('http://localhost:5000/api/auth/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Success! Users found:', usersRes.data.length);
    } catch (err) {
        console.error('Test Failed:', err.response?.data?.error || err.message);
    }
}

testAdmin();
