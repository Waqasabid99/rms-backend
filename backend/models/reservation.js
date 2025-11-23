const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
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
  reservation_time: {
    type: String,
    required: true
  },
  party_size: {
    type: Number,
    required: true,
    min: 1
  },
  composition: {
    adults: {
      type: Number,
      default: 0
    },
    kids: {
      type: Number,
      default: 0
    },
    elders: {
      type: Number,
      default: 0
    },
    specially_abled: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    table_area: {
      type: String,
      enum: ['window', 'patio', 'indoor', 'bar', ''],
      default: ''
    },
    seating_type: {
      type: String,
      enum: ['booth', 'standard', 'high-top', ''],
      default: ''
    },
    accessibility: {
      type: Boolean,
      default: false
    },
    near: {
      type: String,
      default: ''
    }
  },
  parking: {
    required: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['valet', 'self', ''],
      default: ''
    }
  },
  kids_seats: {
    type: Number,
    default: 0
  },
  dietary: {
    plan: {
      type: String,
      enum: ['none', 'vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', ''],
      default: ''
    },
    restrictions: [{
      type: String
    }],
    notes: {
      type: String,
      default: ''
    }
  },
  occasion: {
    type: {
      type: String,
      enum: ['none', 'birthday', 'anniversary', 'business', 'celebration', ''],
      default: ''
    },
    details: {
      type: String,
      default: ''
    }
  },
  special_requests: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
reservationSchema.index({ customer_name: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ reservation_time: 1 });

// Virtual for created_at compatibility with frontend
reservationSchema.virtual('created_at').get(function() {
  return this.createdAt;
});

// Ensure virtuals are included in JSON
reservationSchema.set('toJSON', { virtuals: true });
reservationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Reservation', reservationSchema);