const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Which shop this product belongs to
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  // e.g. "iPhone 13", "Samsung Galaxy A12", "Redmi Note 10"
  deviceModel: {
    type: String,
    required: [true, 'Device model is required'],
    trim: true
  },
  category: {
    type: String,
    default: 'Phone Case',
    trim: true
  },
  // flip / transparent / silicon / hard back / leather
  caseType: {
    type: String,
    trim: true
  },
  // normal / ladies design / premium / kids
  designStyle: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 0
  },
  // e.g. "Shelf 2, Box 3" or "Counter Display A2"
  shelfLocation: {
    type: String,
    trim: true
  },
  // Array of image objects { url, publicId }
  images: [
    {
      url: String,
      publicId: String
    }
  ],
  tags: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  // AI visual search vector - stored as array of numbers
  embedding: {
    type: [Number],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// This creates a full-text search index for fast searching
// Searches across name, deviceModel, and tags simultaneously
productSchema.index({ deviceModel: 'text', name: 'text', tags: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
