const mongoose = require('mongoose');

const deliveryOrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `DO${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  },
  customer_name: {
    type: String,
    required: true,
    trim: true
  },
  customer_phone: {
    type: String,
    required: true,
    trim: true
  },
  customer_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  delivery_address: {
    type: String,
    required: true
  },
  delivery_time: {
    type: String,
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  total: {
    type: Number,
    default: 0,
    min: 0
  },
  delivery_fee: {
    type: Number,
    default: 5.00,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  special_instructions: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
deliveryOrderSchema.index({ customer_name: 1 });
deliveryOrderSchema.index({ status: 1 });
deliveryOrderSchema.index({ delivery_time: 1 });

// Virtual for created_at compatibility with frontend
deliveryOrderSchema.virtual('created_at').get(function() {
  return this.createdAt;
});

// Ensure virtuals are included in JSON
deliveryOrderSchema.set('toJSON', { virtuals: true });
deliveryOrderSchema.set('toObject', { virtuals: true });

// Calculate total before saving
deliveryOrderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('DeliveryOrder', deliveryOrderSchema);