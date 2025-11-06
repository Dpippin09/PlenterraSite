const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SampleManagementService = require('../services/sampleManagement');

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

// @route   POST /api/samples/submit
// @desc    Submit a new soil sample for testing
// @access  Private
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { fieldId, testRequirements, rushOrder = false } = req.body;
    
    if (!fieldId) {
      return res.status(400).json({
        success: false,
        message: 'Field ID is required'
      });
    }
    
    const result = await SampleManagementService.submitSample(
      req.userId, 
      fieldId, 
      testRequirements
    );
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Sample submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit sample'
    });
  }
});

// @route   GET /api/samples/status
// @desc    Get all samples for the authenticated user
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const result = await SampleManagementService.getSampleStatus(req.userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
    
  } catch (error) {
    console.error('Sample status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sample status'
    });
  }
});

// @route   GET /api/samples/:sampleId
// @desc    Get specific sample details
// @access  Private
router.get('/:sampleId', authenticateToken, async (req, res) => {
  try {
    const { sampleId } = req.params;
    const result = await SampleManagementService.getSampleStatus(req.userId, sampleId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
    
  } catch (error) {
    console.error('Sample detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sample details'
    });
  }
});

// @route   GET /api/samples/test-packages
// @desc    Get available soil test packages
// @access  Private
router.get('/test-packages', authenticateToken, async (req, res) => {
  try {
    const testPackages = await SampleManagementService.getTestPackages();
    
    res.json({
      success: true,
      data: testPackages
    });
    
  } catch (error) {
    console.error('Test packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve test packages'
    });
  }
});

// @route   POST /api/samples/:sampleId/track
// @desc    Update sample tracking information (internal use)
// @access  Private
router.post('/:sampleId/track', authenticateToken, (req, res) => {
  try {
    const { sampleId } = req.params;
    const { status, notes, wardLabNumber } = req.body;
    
    // This endpoint can be used for manual tracking updates
    // In production, this would update the sample record
    
    res.json({
      success: true,
      message: 'Sample tracking updated',
      sampleId,
      status
    });
    
  } catch (error) {
    console.error('Sample tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sample tracking'
    });
  }
});

// @route   GET /api/samples/shipping/address
// @desc    Get shipping address for Ward Labs
// @access  Private
router.get('/shipping/address', authenticateToken, (req, res) => {
  try {
    const shippingInfo = SampleManagementService.getShippingAddress();
    
    res.json({
      success: true,
      shippingAddress: shippingInfo
    });
    
  } catch (error) {
    console.error('Shipping address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve shipping address'
    });
  }
});

module.exports = router;
