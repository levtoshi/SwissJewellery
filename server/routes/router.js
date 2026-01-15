import express from 'express';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import * as categoryController from '../controllers/categoryController.js';
import * as productController from '../controllers/productController.js';
import * as orderController from '../controllers/orderController.js';
import * as cartController from '../controllers/cartController.js';
import * as favoriteController from '../controllers/favoritesController.js';

const router = express.Router();

// AUTH
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', protect, authController.logout);
router.get('/auth/me', protect, authController.getMe);

// CATEGORIES
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', protect, adminOnly, categoryController.createCategory);
router.patch('/categories/:id', protect, adminOnly, categoryController.updateCategory);
router.delete('/categories/:id', protect, adminOnly, categoryController.deleteCategory);

// PRODUCTS
router.get('/products', optionalAuth, productController.getProducts);
router.get('/products/:id', optionalAuth, productController.getProductById);
router.post('/products', protect, adminOnly, productController.createProduct);
router.patch('/products/:id', protect, adminOnly, productController.updateProduct);
router.delete('/products/:id', protect, adminOnly, productController.deleteProduct);

// ORDERS
router.post('/orders', optionalAuth, orderController.createOrder);
router.get('/orders', protect, orderController.getOrders);
router.get('/orders/:id', protect, orderController.getOrderById);
router.patch('/orders/:id/status', protect, adminOnly, orderController.updateOrderStatus);
router.patch('/orders/:id/cancel', protect, orderController.cancelOrder);
router.delete('/orders/:id', protect, adminOnly, orderController.deleteOrder);

// CART
router.get('/cart', protect, cartController.getCart);
router.post('/cart/items', protect, cartController.addToCart);
router.patch('/cart/items/:productId', protect, cartController.updateCartItem);
router.delete('/cart/items/:productId', protect, cartController.removeFromCart);
router.delete('/cart', protect, cartController.clearCart);
router.post('/cart/sync', protect, cartController.syncCart);

// FAVORITES
router.get('/favorites', protect, favoriteController.getFavorites);
router.post('/favorites/:productId', protect, favoriteController.addFavorite);
router.delete('/favorites/:productId', protect, favoriteController.removeFavorite);

export default router;