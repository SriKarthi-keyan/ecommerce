import { Router } from 'express';
import { getStatus } from '../controllers/statusController.js';
import { login, register } from '../controllers/authController.js';
import { getProducts } from '../controllers/productController.js';

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

export default router;


