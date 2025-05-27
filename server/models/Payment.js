const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paypalOrderId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  status: {
    type: String,
    required: true,
    enum: ['CREATED', 'SAVED', 'APPROVED', 'VOIDED', 'COMPLETED', 'FAILED'],
    default: 'CREATED'
  },
  payerEmail: String,
  payerName: String,
  items: [
    {
      name: String,
      description: String,
      quantity: Number,
      unitAmount: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on every save
PaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);