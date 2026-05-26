const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// ─── LOAD .env FILE ─────────────────────────────────────────
// This MUST be the very first thing — before anything else
require('dotenv').config();

// ─── VERIFY ENV IS LOADED ───────────────────────────────────
// This will print what MONGODB_URI looks like when server starts
// Remove these lines after confirming it works
console.log('=== ENV CHECK ===');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'UNDEFINED - .env not loaded!');
console.log('=================');

const app = express();

// ─── SECURITY MIDDLEWARE ────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests. Please wait a few minutes.' }
});
app.use('/api/', limiter);

// Allow frontend to connect
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── DATABASE CONNECTION ─────────────────────────────────────
// Only connect if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI is not set in .env file!');
  console.error('   Make sure your .env file exists in the backend folder');
  console.error('   and contains: MONGODB_URI=mongodb+srv://...');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   Check your MONGODB_URI in .env file');
    process.exit(1);
  });

// ─── ROUTES ─────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/search', require('./routes/search'));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Mobile Shop API is running',
    time: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` });
});

// ─── START SERVER ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
