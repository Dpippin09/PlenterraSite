const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
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

// Configure axios instance for Ward Labs API
const wardLabsAPI = axios.create({
  baseURL: process.env.WARD_LABS_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-ward-api-key': process.env.WARD_LABS_API_KEY
  }
});

// @route   GET /api/soil/reports/:farmerId
// @desc    Get soil reports from Ward Labs for a specific farmer
// @access  Private
router.get('/reports/:farmerId', authenticateToken, async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Call Ward Labs API (replace with actual endpoint structure)
    const response = await wardLabsAPI.get(`/reports/${farmerId}`);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Ward Labs API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'No soil reports found for this farmer'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch soil reports',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/soil/submit-sample
// @desc    Submit soil sample to Ward Labs
// @access  Private
router.post('/submit-sample', authenticateToken, async (req, res) => {
  try {
    const sampleData = {
      ...req.body,
      farmerId: req.userId, // Add authenticated user ID
      submittedAt: new Date().toISOString()
    };

    // Call Ward Labs API to submit sample
    const response = await wardLabsAPI.post('/samples', sampleData);

    res.json({
      success: true,
      message: 'Soil sample submitted successfully',
      data: response.data
    });

  } catch (error) {
    console.error('Ward Labs Sample Submit Error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit soil sample',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/soil/recommendations/:fieldId
// @desc    Get soil recommendations from Ward Labs
// @access  Private
router.get('/recommendations/:fieldId', authenticateToken, async (req, res) => {
  try {
    const { fieldId } = req.params;

    // Call Ward Labs API for recommendations
    const response = await wardLabsAPI.get(`/recommendations/${fieldId}`);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Ward Labs Recommendations Error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/soil/sample-types
// @desc    Get available sample types from Ward Labs
// @access  Private
router.get('/sample-types', authenticateToken, async (req, res) => {
  try {
    const response = await wardLabsAPI.get('/sample-types');

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Ward Labs Sample Types Error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sample types',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/soil/test-connection
// @desc    Test Ward Labs API connection (dev only)
// @access  Private
router.get('/test-connection', authenticateToken, async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }

  try {
    // Test connection to Ward Labs API using sample-types endpoint
    const response = await wardLabsAPI.get('/sample-types');

    res.json({
      success: true,
      message: 'Ward Labs API connection successful',
      status: response.status,
      data: response.data
    });

  } catch (error) {
    console.error('Ward Labs Connection Test Error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Ward Labs API connection failed',
      error: error.response?.data || error.message,
      statusCode: error.response?.status,
      config: {
        baseURL: wardLabsAPI.defaults.baseURL,
        hasApiKey: !!process.env.WARD_LABS_API_KEY,
        headers: {
          'Content-Type': wardLabsAPI.defaults.headers['Content-Type'],
          'X-API-Key': !!wardLabsAPI.defaults.headers['X-API-Key'] ? 'Present' : 'Missing'
        }
      }
    });
  }
});

module.exports = router;
