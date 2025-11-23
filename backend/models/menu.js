const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'side'],
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
menuSchema.index({ name: 1 });
menuSchema.index({ category: 1 });
menuSchema.index({ available: 1 });
menuSchema.index({ name: 'text', description: 'text' }); // Text index for search

// Virtual for created_at compatibility with frontend
menuSchema.virtual('created_at').get(function() {
  return this.createdAt;
});

// Ensure virtuals are included in JSON
menuSchema.set('toJSON', { virtuals: true });
menuSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Menu', menuSchema);