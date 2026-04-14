const express = require('express');
const { register, login, getMe, getStats, updateProfile, getAllUsers, deleteUser } = require('../controllers/authController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, upload.single('profilePic'), updateProfile);
router.get('/stats', authenticate, getStats);

// Admin Routes
router.get('/users', authenticate, authorizeAdmin, getAllUsers);
router.delete('/users/:id', authenticate, authorizeAdmin, deleteUser);

module.exports = router;
