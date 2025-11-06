const express = require('express');
const jwt = require('jsonwebtoken');
const { findUser, findUserIndex, updateUser } = require('../data/users');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.userId = decoded.userId;
    next();
  });
};

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = findUser(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      user: userProfile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const userIndex = findUserIndex(u => u.id === req.userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const allowedFields = ['firstName', 'lastName', 'farmName', 'totalAcres', 'farmingType', 'primaryCrops', 'yearsFarming'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Apply updates
    const updatedUser = updateUser(userIndex, { ...updates, updatedAt: new Date().toISOString() });

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }

    // Remove password from response
    const { password, ...userProfile } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userProfile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/fields
// @desc    Get user's fields
// @access  Private
router.get('/fields', authenticateToken, (req, res) => {
  try {
    const user = findUser(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      fields: user.fields || []
    });

  } catch (error) {
    console.error('Get fields error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/fields
// @desc    Add new field
// @access  Private
router.post('/fields', authenticateToken, (req, res) => {
  try {
    const { name, size, crop, soilType } = req.body;

    if (!name || !size) {
      return res.status(400).json({
        success: false,
        message: 'Field name and size are required'
      });
    }

    const userIndex = findUserIndex(u => u.id === req.userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newField = {
      id: Date.now().toString(),
      name,
      size: parseFloat(size),
      crop: crop || 'Not specified',
      soilType: soilType || 'Unknown',
      healthScore: 6.0,
      lastTreatment: null,
      createdAt: new Date().toISOString()
    };

    const user = findUser(u => u.id === req.userId);
    const existingFields = user.fields || [];
    const updatedFields = [...existingFields, newField];

    const updatedUser = updateUser(userIndex, { fields: updatedFields });

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to add field'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Field added successfully',
      field: newField
    });

  } catch (error) {
    console.error('Add field error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
