const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const prisma = require('./src/config/db');

const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

console.log("Server starting...");
console.log("Environment check:");
console.log("- PORT:", port);
console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "MISSING");
console.log("- AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID ? "Defined" : "MISSING");

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger for debugging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// Root API Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

// Base health check with DB test
app.get(['/api/health', '/health'], async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', db: 'connected' });
    } catch (err) {
        console.error("Health Check DB Error:", err);
        res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
    }
});

// Global 404 handler for debugging
app.use((req, res) => {
    console.log(`[404] ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    try {
        require('fs').appendFileSync('error.txt', new Date().toISOString() + ' GLOBAL ERROR: ' + err.message + '\n' + err.stack + '\n');
    } catch (logErr) {
        console.error("Failed to write to error.txt:", logErr);
    }
    res.status(500).json({ error: err.message || 'Something went wrong internally.' });
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}).on('error', (err) => {
    console.error("SERVER STARTUP ERROR:", err);
    try {
        require('fs').appendFileSync('error.txt', new Date().toISOString() + ' SERVER STARTUP ERROR: ' + err.message + '\n' + err.stack + '\n');
    } catch (lErr) {}
    process.exit(1);
});
