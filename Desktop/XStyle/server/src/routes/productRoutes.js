const express = require('express');
const { 
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
} = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const s3Upload = require('../middlewares/upload-s3'); // renamed to avoid confusion
const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.post('/categories', authenticate, authorizeAdmin, createCategory);
router.delete('/categories/:id', authenticate, authorizeAdmin, deleteCategory);

router.get('/reviews', authenticate, authorizeAdmin, getAllReviews);
router.delete('/reviews/:id', authenticate, authorizeAdmin, deleteReview);

router.get('/free-gifts', getFreeGifts);
router.get('/:id', getProductById);
router.post('/:id/reviews', authenticate, upload.single('image'), addReview);
router.post('/', authenticate, authorizeAdmin, upload.any(), createProduct);
router.put('/:id', authenticate, authorizeAdmin, upload.any(), updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
