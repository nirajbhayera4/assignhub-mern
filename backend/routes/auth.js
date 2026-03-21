const express = require('express');
const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', (req, res) => {
  res.json({ message: 'Register user' });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', (req, res) => {
  res.json({ message: 'Login user' });
});

module.exports = router;