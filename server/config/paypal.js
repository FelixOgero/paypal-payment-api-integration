const paypal = require('@paypal/checkout-server-sdk');
const dotenv = require('dotenv');

dotenv.config();

// Creating an environment
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = process.env.PAYPAL_MODE === 'live'
  ? new paypal.core.LiveEnvironment(clientId, clientSecret)
  : new paypal.core.SandboxEnvironment(clientId, clientSecret);

const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };