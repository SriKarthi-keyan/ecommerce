import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS } from './productController.js';

// Resolve current directory path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'carts.json');

/**
 * Helper to read carts data from the JSON file database.
 */
const readCarts = () => {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return {};
    }
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error('❌ Error reading carts file:', error);
    return {};
  }
};

/**
 * Helper to write carts data to the JSON file database.
 */
const writeCarts = (carts) => {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(carts, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('❌ Error writing carts file:', error);
    return false;
  }
};

/**
 * Helper to populate cart items with full product details and calculate totals.
 */
const getPopulatedCart = (userId) => {
  const carts = readCarts();
  const userItems = carts[userId] || [];
  
  const items = [];
  let totalItems = 0;
  let subtotal = 0;

  for (const item of userItems) {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (product) {
      totalItems += item.quantity;
      subtotal += item.quantity * product.price;
      items.push({
        productId: item.productId,
        quantity: item.quantity,
        product
      });
    }
  }

  // Format subtotal
  subtotal = parseFloat(subtotal.toFixed(2));

  // 10% Discount if subtotal is over $150
  const discountThreshold = 150;
  const discountRate = 0.10;
  const discount = subtotal >= discountThreshold 
    ? parseFloat((subtotal * discountRate).toFixed(2)) 
    : 0;

  // Shipping is free (0) if subtotal > 100, else $10.00 (0 if cart is empty)
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10.00;

  // Estimated Tax: 8% of (subtotal - discount)
  const taxRate = 0.08;
  const tax = parseFloat(((subtotal - discount) * taxRate).toFixed(2));

  // Order Total
  const orderTotal = parseFloat((subtotal - discount + shipping + tax).toFixed(2));

  return {
    items,
    totalItems,
    subtotal,
    discount,
    shipping,
    tax,
    orderTotal
  };
};

/**
 * Get current user's cart
 * @route GET /api/cart
 * @access Public/Private
 */
export const getCart = (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = getPopulatedCart(userId);

    return res.status(200).json({
      status: 'success',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add product to cart
 * @route POST /api/cart
 * @access Public/Private
 */
export const addToCart = (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // 1. Validation
    if (!productId) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID is required'
      });
    }

    const productExists = PRODUCTS.some(p => p.id === productId);
    if (!productExists) {
      return res.status(404).json({
        status: 'error',
        message: `Product with ID ${productId} not found`
      });
    }

    const parsedQuantity = parseInt(quantity, 10);
    const addedQuantity = isNaN(parsedQuantity) ? 1 : parsedQuantity;

    if (addedQuantity <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be a positive integer'
      });
    }

    // 2. Logic to add/update item in cart
    const carts = readCarts();
    if (!carts[userId]) {
      carts[userId] = [];
    }

    const existingItemIndex = carts[userId].findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      // Increase quantity
      carts[userId][existingItemIndex].quantity += addedQuantity;
    } else {
      // Add new item
      carts[userId].push({ productId, quantity: addedQuantity });
    }

    // Write back to database
    writeCarts(carts);

    // Get updated populated cart
    const cart = getPopulatedCart(userId);

    return res.status(200).json({
      status: 'success',
      message: 'Product added to cart successfully',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update quantity of a product in the cart
 * @route PUT /api/cart/:productId
 * @access Public/Private
 */
export const updateCartItem = (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity is required'
      });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity)) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be an integer'
      });
    }

    const carts = readCarts();
    const userCart = carts[userId] || [];
    const itemIndex = userCart.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found in your cart'
      });
    }

    if (parsedQuantity <= 0) {
      // Remove item if quantity is set to 0 or less
      userCart.splice(itemIndex, 1);
    } else {
      // Update quantity
      userCart[itemIndex].quantity = parsedQuantity;
    }

    carts[userId] = userCart;
    writeCarts(carts);

    const cart = getPopulatedCart(userId);

    return res.status(200).json({
      status: 'success',
      message: parsedQuantity <= 0 ? 'Item removed from cart' : 'Cart updated successfully',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove product from cart
 * @route DELETE /api/cart/:productId
 * @access Public/Private
 */
export const removeFromCart = (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const carts = readCarts();
    const userCart = carts[userId] || [];
    const itemIndex = userCart.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found in your cart'
      });
    }

    // Remove item
    userCart.splice(itemIndex, 1);
    carts[userId] = userCart;
    writeCarts(carts);

    const cart = getPopulatedCart(userId);

    return res.status(200).json({
      status: 'success',
      message: 'Product removed from cart successfully',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear the entire cart
 * @route DELETE /api/cart
 * @access Public/Private
 */
export const clearCart = (req, res, next) => {
  try {
    const userId = req.user.id;
    const carts = readCarts();

    // Reset user's cart
    carts[userId] = [];
    writeCarts(carts);

    const cart = getPopulatedCart(userId);

    return res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};
