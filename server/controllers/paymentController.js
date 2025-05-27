const { v4: uuidv4 } = require('uuid');
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../config/paypal');
const Payment = require('../models/Payment');

// Create a PayPal order
exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    
    if (!items || !total) {
      return res.status(400).json({ message: 'Items and total are required' });
    }
    
    // Create unique order ID for our system
    const orderId = uuidv4();
    
    // Create PayPal order request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          description: 'Purchase from MERN PayPal App',
          amount: {
            currency_code: 'USD',
            value: total,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: total
              }
            }
          },
          items: items.map(item => ({
            name: item.name,
            description: item.description || '',
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: 'USD',
              value: item.unitAmount.toString()
            }
          }))
        }
      ],
      application_context: {
        return_url: `${req.protocol}://${req.get('host')}/api/payments/capture-order`,
        cancel_url: `${req.protocol}://${req.get('host')}/api/payments/cancel-order`
      }
    });

    // Call PayPal API to create order
    const order = await client.execute(request);
    
    // Save payment information to database
    const newPayment = new Payment({
      orderId,
      paypalOrderId: order.result.id,
      amount: total,
      currency: 'USD',
      status: 'CREATED',
      items: items.map(item => ({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        unitAmount: item.unitAmount
      }))
    });
    
    await newPayment.save();
    
    // Return the PayPal order ID and approval URL
    return res.status(201).json({
      orderId: newPayment.orderId,
      paypalOrderId: order.result.id,
      status: order.result.status,
      approvalUrl: order.result.links.find(link => link.rel === 'approve').href
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

// Capture a PayPal order (after user approval)
exports.captureOrder = async (req, res) => {
  try {
    const { token } = req.query; // PayPal order ID comes as 'token' in the query
    
    // Verify the token/order exists in our database
    const payment = await Payment.findOne({ paypalOrderId: token });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Execute the PayPal capture request
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});
    
    const capture = await client.execute(request);
    
    // Update payment information in database
    const captureData = capture.result;
    const captureId = captureData.purchase_units[0].payments.captures[0].id;
    const captureStatus = captureData.status;
    
    // Get payer information
    const payerName = captureData.payer.name 
      ? `${captureData.payer.name.given_name} ${captureData.payer.name.surname}`
      : '';
    const payerEmail = captureData.payer.email_address || '';
    
    // Update payment record
    payment.status = captureStatus === 'COMPLETED' ? 'COMPLETED' : 'APPROVED';
    payment.payerName = payerName;
    payment.payerEmail = payerEmail;
    
    await payment.save();
    
    // Redirect to success page with the order ID
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/success?orderId=${payment.orderId}`);
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/cancel?error=capture_failed`);
  }
};

// Handle PayPal order cancellation
exports.cancelOrder = async (req, res) => {
  try {
    const { token } = req.query;
    
    // Find and update the payment status
    const payment = await Payment.findOne({ paypalOrderId: token });
    
    if (payment) {
      payment.status = 'VOIDED';
      await payment.save();
    }
    
    // Redirect to cancel page
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/cancel`);
  } catch (error) {
    console.error('Error canceling order:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/cancel?error=cancel_failed`);
  }
};

// Handle PayPal webhook events
exports.handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    
    // Verify the webhook signature (in production, you would validate the signature)
    // This is a simplified implementation
    
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resourceId = event.resource.id;
      const orderId = event.resource.supplementary_data.related_ids.order_id;
      
      // Update the payment status in the database
      const payment = await Payment.findOne({ paypalOrderId: orderId });
      
      if (payment) {
        payment.status = 'COMPLETED';
        await payment.save();
        console.log(`Payment ${payment.orderId} completed successfully`);
      }
    }
    
    // Acknowledge receipt of the event
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error handling PayPal webhook:', error);
    return res.status(500).json({ error: 'Webhook handling failed' });
  }
};

// Get payment by order ID
exports.getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ orderId });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    return res.status(200).json(payment);
  } catch (error) {
    console.error('Error retrieving payment:', error);
    return res.status(500).json({ error: 'Failed to retrieve payment' });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    return res.status(200).json(payments);
  } catch (error) {
    console.error('Error retrieving payments:', error);
    return res.status(500).json({ error: 'Failed to retrieve payments' });
  }
};