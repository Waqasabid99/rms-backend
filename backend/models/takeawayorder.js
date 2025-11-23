const mongoose = require('mongoose');

const takeawayOrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `TO${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
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
  pickup_time: {
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
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
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
takeawayOrderSchema.index({ customer_name: 1 });
takeawayOrderSchema.index({ status: 1 });
takeawayOrderSchema.index({ pickup_time: 1 });

// Virtual for created_at compatibility with frontend
takeawayOrderSchema.virtual('created_at').get(function() {
  return this.createdAt;
});

// Ensure virtuals are included in JSON
takeawayOrderSchema.set('toJSON', { virtuals: true });
takeawayOrderSchema.set('toObject', { virtuals: true });

// Calculate total before saving
takeawayOrderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('TakeawayOrder', takeawayOrderSchema);