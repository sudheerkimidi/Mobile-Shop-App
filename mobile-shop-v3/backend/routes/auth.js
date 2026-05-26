const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// ─── REGISTER ─────────────────────────────────────────────
// POST /api/auth/register
// Creates a new shop owner account (needs admin approval before login works)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, shopName, shopLocation, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !shopName) {
      return res.status(400).json({ message: 'Name, email, password and shop name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already registered
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    // Hash password - never store plain text passwords
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if this is the very first user - make them admin automatically
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      shopName,
      shopLocation,
      phone,
      // First user is admin and auto-approved
      isApproved: isFirstUser,
      role: isFirstUser ? 'admin' : 'owner'
    });

    await user.save();

    if (isFirstUser) {
      res.status(201).json({
        message: 'Admin account created successfully. You can login now.',
        isAdmin: true
      });
    } else {
      res.status(201).json({
        message: 'Account created! Please wait for admin approval before logging in.',
        isAdmin: false
      });
    }
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── LOGIN ─────────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if account is approved
    if (!user.isApproved) {
      return res.status(403).json({
        message: 'Your account is waiting for admin approval. Please contact the admin.'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token - expires in 7 days
    const token = jwt.sign(
      { userId: user._id, role: user.role, shopName: user.shopName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        shopName: user.shopName,
        shopLocation: user.shopLocation,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── GET CURRENT USER ──────────────────────────────────────
// GET /api/auth/me  (protected route - needs token)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: GET ALL PENDING USERS ─────────────────────────
// GET /api/auth/pending  (admin only)
router.get('/pending', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }
    const users = await User.find({ isApproved: false }).select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: APPROVE USER ──────────────────────────────────
// PUT /api/auth/approve/:id  (admin only)
router.put('/approve/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }
    await User.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: 'User approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
