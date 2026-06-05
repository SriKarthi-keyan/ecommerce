import { Router } from 'express';
import { getStatus } from '../controllers/statusController.js';
import { login, register } from '../controllers/authController.js';
import { getProducts } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';

const router = Router();

// Health/Status Route
router.get('/status', getStatus);

// Authentication Routes
router.post('/login', login);
router.post('/register', register);
router.post('/auth/login', login);
router.post('/auth/signup', register);

// Product Routes
router.get('/products', getProducts);

// Cart Routes
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart/:productId', protect, updateCartItem);
router.delete('/cart/:productId', protect, removeFromCart);
router.delete('/cart', protect, clearCart);

export default router;


