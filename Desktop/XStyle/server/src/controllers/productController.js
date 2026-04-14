const prisma = require('../config/db');

const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({ 
            where: { isFreeGift: false },
            include: { category: true, reviews: { include: { user: { select: { name: true } } } } } 
        });
        res.json(products);
    } catch (err) {
        try {
            require('fs').appendFileSync('error.txt', new Date().toISOString() + ' getAllProducts ERROR: ' + err.message + '\n' + err.stack + '\n');
        } catch (lErr) {}
        res.status(500).json({ error: err.message });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid product ID.' });
    }
    try {
        const product = await prisma.product.findUnique({
            where: { id: parsedId },
            include: { category: true, reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } } }
        });
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        res.json(product);
    } catch (err) {
        try {
            require('fs').appendFileSync('error.txt', new Date().toISOString() + ' getProductById ERROR: ' + err.message + '\n' + err.stack + '\n');
        } catch (lErr) {}
        res.status(500).json({ error: err.message });
    }
};

const getFreeGifts = async (req, res) => {
    console.log("Fetching Free Gifts...");
    try {
        const products = await prisma.product.findMany({
            where: { isFreeGift: true },
            include: { category: true }
        });
        console.log("Gifts found in DB:", products.length);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createProduct = async (req, res) => {
    console.log("Create Product Request - Body:", req.body);
    console.log("Create Product Request - Files:", req.files?.map(f => ({ field: f.fieldname, name: f.originalname })));
    try {
        const { name, description, sizes, colors, isTrending, stock, isFreeGift } = req.body;
        let { categoryId, price } = req.body;
        let imageUrl = req.body.imageUrl;
        let colorImages = {};

        // Robust parsing to avoid NaN errors
        const parsedCategoryId = parseInt(categoryId);
        const parsedPrice = parseFloat(price || 0);
        const parsedStock = parseInt(stock || 0);

        if (isNaN(parsedCategoryId)) {
            return res.status(400).json({ error: 'Valid Category ID is required.' });
        }

        if (req.files && Array.isArray(req.files)) {
            const mainFile = req.files.find(f => f.fieldname === 'image');
            if (mainFile) imageUrl = mainFile.location || `/uploads/${mainFile.filename}`;
            req.files.forEach(f => {
                if (f.fieldname.startsWith('colorImage_')) {
                    const color = f.fieldname.replace('colorImage_', '');
                    colorImages[color] = f.location || `/uploads/${f.filename}`;
                }
            });
        }
        
        const isTrendingBool = Array.isArray(req.body.isTrending) 
            ? req.body.isTrending.includes('true') || req.body.isTrending.includes(true)
            : req.body.isTrending === 'true' || req.body.isTrending === true;

        const isFreeGiftBool = Array.isArray(req.body.isFreeGift)
            ? req.body.isFreeGift.includes('true') || req.body.isFreeGift.includes(true)
            : req.body.isFreeGift === 'true' || req.body.isFreeGift === true;

        const product = await prisma.product.create({
            data: {
                name,
                price: parsedPrice,
                description,
                categoryId: parsedCategoryId,
                imageUrl,
                colorImages,
                stock: parsedStock,
                isTrending: isTrendingBool,
                isFreeGift: isFreeGiftBool,
                sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim())) : undefined,
                colors: colors ? (Array.isArray(colors) ? colors : colors.split(',').map(c => c.trim())) : undefined,
            },
            include: { category: true }
        });
        res.status(201).json(product);
    } catch (err) {
        console.error("Create Product Error:", err);
        try {
            require('fs').appendFileSync('error.txt', new Date().toISOString() + ' createProduct ERROR: ' + err.message + '\n' + err.stack + '\n');
        } catch (lErr) {}
        res.status(500).json({ error: err.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        let updateData = { ...req.body };
        
        if (updateData.categoryId !== undefined) {
            updateData.categoryId = parseInt(updateData.categoryId);
            if (isNaN(updateData.categoryId)) delete updateData.categoryId;
        }
        if (updateData.price !== undefined) {
            updateData.price = parseFloat(updateData.price);
            if (isNaN(updateData.price)) updateData.price = 0;
        }
        if (updateData.stock !== undefined) {
            updateData.stock = parseInt(updateData.stock || 0);
            if (isNaN(updateData.stock)) updateData.stock = 0;
        }
        if (updateData.rating !== undefined) {
            updateData.rating = parseFloat(updateData.rating);
            if (isNaN(updateData.rating)) delete updateData.rating;
        }

        if (updateData.isTrending !== undefined) {
            updateData.isTrending = Array.isArray(updateData.isTrending)
                ? updateData.isTrending.includes('true') || updateData.isTrending.includes(true)
                : updateData.isTrending === 'true' || updateData.isTrending === true;
        }
        if (updateData.isFreeGift !== undefined) {
            updateData.isFreeGift = Array.isArray(updateData.isFreeGift)
                ? updateData.isFreeGift.includes('true') || updateData.isFreeGift.includes(true)
                : updateData.isFreeGift === 'true' || updateData.isFreeGift === true;
        }
        
        if (updateData.sizes !== undefined) {
            updateData.sizes = updateData.sizes ? (typeof updateData.sizes === 'string' ? updateData.sizes.split(',').map(s => s.trim()) : updateData.sizes) : [];
        }
        if (updateData.colors !== undefined) {
            updateData.colors = updateData.colors ? (typeof updateData.colors === 'string' ? updateData.colors.split(',').map(c => c.trim()) : updateData.colors) : [];
        }

        const existingProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
        let nextColorImages = existingProduct?.colorImages || {};

        if (updateData.existingColorImages) {
            try {
                nextColorImages = JSON.parse(updateData.existingColorImages);
            } catch(e) {}
            delete updateData.existingColorImages;
        }

        if (req.files && Array.isArray(req.files)) {
            const mainFile = req.files.find(f => f.fieldname === 'image');
            if (mainFile) {
                updateData.imageUrl = mainFile.location || `/uploads/${mainFile.filename}`;
            }
            req.files.forEach(f => {
                if (f.fieldname.startsWith('colorImage_')) {
                    const color = f.fieldname.replace('colorImage_', '');
                    nextColorImages[color] = f.location || `/uploads/${f.filename}`;
                }
            });
        }
        
        updateData.colorImages = nextColorImages;

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json({ message: 'Product updated successfully!', product });
    } catch (err) {
        console.error("Update Product Error:", err);
        try {
            require('fs').appendFileSync('error.txt', new Date().toISOString() + ' updateProduct ERROR: ' + err.message + '\n' + err.stack + '\n');
        } catch(lErr) {}
        res.status(500).json({ error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Product deleted successfully!' });
    } catch (err) {
        require('fs').appendFileSync('error.txt', new Date().toISOString() + ' createProduct ERROR: ' + err.message + '\n' + err.stack + '\n');
        res.status(500).json({ error: err.message });
    }
};

const addReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
        const hasDeliveredOrder = await prisma.order.findFirst({
            where: {
                userId,
                status: 'DELIVERED',
                orderItems: { some: { productId: parseInt(id) } }
            }
        });

        if (!hasDeliveredOrder) {
            return res.status(403).json({ error: 'You can only review products you have purchased and received.' });
        }
        const review = await prisma.review.create({
            data: {
                productId: parseInt(id),
                userId,
                rating: parseInt(rating),
                comment,
                imageUrl
            },
            include: { user: { select: { name: true } } }
        });

        // Optional: Update the product's overall rating
        const allReviews = await prisma.review.findMany({ where: { productId: parseInt(id) } });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await prisma.product.update({ where: { id: parseInt(id) }, data: { rating: avgRating } });

        res.status(201).json(review);
    } catch (err) {
        require('fs').appendFileSync('error.txt', new Date().toISOString() + ' createProduct ERROR: ' + err.message + '\n' + err.stack + '\n');
        res.status(500).json({ error: err.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (err) {
        require('fs').appendFileSync('error.txt', new Date().toISOString() + ' createProduct ERROR: ' + err.message + '\n' + err.stack + '\n');
        res.status(500).json({ error: err.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({ data: { name } });
        res.status(201).json(category);
    } catch (err) {
        require('fs').appendFileSync('error.txt', new Date().toISOString() + ' createProduct ERROR: ' + err.message + '\n' + err.stack + '\n');
        res.status(500).json({ error: err.message });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true, imageUrl: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.review.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Review deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Category deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getFreeGifts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    createCategory,
    deleteCategory,
    addReview,
    getAllReviews,
    deleteReview
};
