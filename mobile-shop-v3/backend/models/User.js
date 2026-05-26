const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true
  },
  shopLocation: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  // Admin must approve before shop owner can login
  isApproved: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['owner', 'admin'],
    default: 'owner'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
