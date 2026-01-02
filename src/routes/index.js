const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const categoriesController = require('../controllers/categoriesController');
const ordersController = require('../controllers/ordersController');

// Rutas de productos
router.get('/products', productsController.getAllProducts);
router.get('/products/:id', productsController.getProductById);
router.post('/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

// Rutas de categorías
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:id', categoriesController.getCategoryById);
router.post('/categories', categoriesController.createCategory);
router.put('/categories/:id', categoriesController.updateCategory);
router.delete('/categories/:id', categoriesController.deleteCategory);

// Rutas de órdenes
router.get('/orders', ordersController.getAllOrders);
router.get('/orders/:id', ordersController.getOrderById);
router.post('/orders', ordersController.createOrder);
router.patch('/orders/:id/status', ordersController.updateOrderStatus);

module.exports = router;