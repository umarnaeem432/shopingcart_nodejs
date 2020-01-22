const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart); // View the cart.

router.post('/cart', shopController.postCart); // add-to-cart.

router.post('/cart/delete-item', shopController.deleteProductFromCart);

// router.get('/orders', shopController.getOrders); // Display the orders.

// router.post('/create-order', shopController.postOrder);

module.exports = router;