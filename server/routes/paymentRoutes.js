const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Create a PayPal order
router.post('/create-order', paymentController.createOrder);

// Capture an approved PayPal order
router.get('/capture-order', paymentController.captureOrder);

// Handle cancellation
router.get('/cancel-order', paymentController.cancelOrder);

// Handle PayPal webhooks
router.post('/webhook', paymentController.handleWebhook);

// Get payment by order ID
router.get('/:orderId', paymentController.getPaymentByOrderId);

// Get all payments
router.get('/', paymentController.getAllPayments);

module.exports = router;