const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory user storage (replace with MongoDB in production)
let users = [];

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      farmName,
      farmSize,
      farmType
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !username || !password || !farmName || !farmSize || !farmType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => 
      user.email.toLowerCase() === email.toLowerCase() || 
      user.username.toLowerCase() === username.toLowerCase()
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const newUser = {
      id: Date.now().toString(), // Simple ID generation (use proper UUID in production)
      firstName,
      lastName,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      farmName,
      totalAcres: farmSize,
      farmingType: farmType,
      yearsFarming: 1,
      primaryCrops: 'Not specified',
      stats: {
        soilHealthScore: 6.0,
        waterRetention: 70,
        carbonSequestered: 0,
        totalCredits: 0
      },
      fields: [
        {
          id: 'main',
          name: 'Main Field',
          size: farmSize,
          crop: 'Not specified',
          soilType: 'Unknown',
          healthScore: 6.0,
          lastTreatment: null
        }
      ],
      createdAt: new Date().toISOString()
    };

    // Store user (in production, save to MongoDB)
    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Find user
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() || 
      u.email.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
