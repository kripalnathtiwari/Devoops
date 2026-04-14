const express = require('express');
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/history', authenticate, getUserOrders);
router.get('/admin', authenticate, authorizeAdmin, getAllOrders);
router.put('/admin/:id', authenticate, authorizeAdmin, updateOrderStatus);

module.exports = router;
