const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'fallback_secret';
const payload = { id: 1, role: 'ADMIN' };
const token = jwt.sign(payload, secret);

try {
    const decoded = jwt.verify(token, secret);
    console.log('Verification Success:', decoded);
    console.log('Secret used:', secret);
} catch (err) {
    console.error('Verification failed:', err.message);
}
