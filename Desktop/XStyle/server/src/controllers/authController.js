const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const register = async (req, res) => {
    let { name, email, password } = req.body;
    try {
        if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });
        email = email.toLowerCase().trim();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: 'Registration successful!', user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address, city: user.city, zip: user.zip, phone: user.phone, profilePic: user.profilePic }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    let { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
        email = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Login successful!', user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address, city: user.city, zip: user.zip, phone: user.phone, profilePic: user.profilePic }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMe = async (req, res) => {
    res.json(req.user);
};

const getStats = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            select: { totalPrice: true }
        });
        const totalSpent = orders.reduce((acc, o) => acc + parseFloat(o.totalPrice), 0);
        res.json({ totalSpent, orderCount: orders.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, address, city, zip, phone } = req.body;
        const dataToUpdate = {};
        
        if (name !== undefined) dataToUpdate.name = name;
        if (address !== undefined) dataToUpdate.address = address;
        if (city !== undefined) dataToUpdate.city = city;
        if (zip !== undefined) dataToUpdate.zip = zip;
        if (phone !== undefined) dataToUpdate.phone = phone;
        
        if (req.file) {
            dataToUpdate.profilePic = `/uploads/${req.file.filename}`;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ error: 'No fields provided to update.' });
        }
        
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: dataToUpdate
        });
        
        res.json({ 
            message: 'Profile updated', 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                address: user.address, 
                city: user.city, 
                zip: user.zip, 
                phone: user.phone, 
                profilePic: user.profilePic 
            } 
        });
    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'User deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true, address: true, city: true, phone: true, profilePic: true }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login, getMe, getStats, updateProfile, getAllUsers, deleteUser };
