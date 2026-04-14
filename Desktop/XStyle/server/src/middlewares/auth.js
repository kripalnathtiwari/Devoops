const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: 'User no longer exists.' });
        
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };
