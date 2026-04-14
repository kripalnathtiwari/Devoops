const prisma = require('../config/db');

const createOrder = async (req, res) => {
    const { items, totalPrice, address } = req.body;
    const userId = req.user.id;

    try {
        if (!items || items.length === 0) return res.status(400).json({ error: 'Order items are required.' });

        // Check for free gifts in items
        const productIds = items.map(i => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        const freeGiftProducts = products.filter(p => p.isFreeGift);
        const hasFreeGift = freeGiftProducts.length > 0;
        
        if (hasFreeGift) {
            // Check if multiple different free products or total quantity > 1
            const freeGiftProductIds = freeGiftProducts.map(p => p.id);
            const totalFreeGiftQty = items
                .filter(i => freeGiftProductIds.includes(i.productId))
                .reduce((sum, i) => sum + (i.quantity || 1), 0);

            if (totalFreeGiftQty > 1) {
                return res.status(400).json({ error: 'You can only claim exactly one free gift.' });
            }
            
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user.hasClaimedFreeGift) {
                return res.status(400).json({ error: 'You have already claimed your free gift.' });
            }
        }

        const order = await prisma.order.create({
            data: {
                userId,
                totalPrice,
                address,
                orderItems: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: { orderItems: true }
        });

        // If order contains a free gift, mark user as claimed
        if (hasFreeGift) {
            await prisma.user.update({
                where: { id: userId },
                data: { hasClaimedFreeGift: true }
            });
        }

        res.status(201).json({ message: 'Order created successfully!', order });
    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).json({ error: err.message });
    }
};

const getUserOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { orderItems: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: true, orderItems: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json({ message: 'Order status updated successfully!', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };
