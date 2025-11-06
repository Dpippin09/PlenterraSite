// Ward Labs Integration Service - Handles the complete workflow
const express = require('express');
const router = express.Router();
const wardLabsCache = require('../services/wardLabsCache');
const { findUser } = require('../data/users');

// =====================================================
// OUTBOUND: Services we call (Ward Labs endpoints)
// =====================================================

// @route   GET /api/ward-labs/sample-types
// @desc    Get available sample types (cache for 2 hours)
// @access  Private
router.get('/sample-types', async (req, res) => {
  try {
    const data = await wardLabsCache.get('/sample-types', 2 * 60 * 60 * 1000); // 2 hours cache
    res.json({ success: true, data });
  } catch (error) {
    console.error('Sample types error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sample types' });
  }
});

// @route   GET /api/ward-labs/test-packages
// @desc    Get available test packages (cache for 4 hours - pricing doesn't change often)
// @access  Private
router.get('/test-packages', async (req, res) => {
  try {
    const data = await wardLabsCache.get('/test-packages', 4 * 60 * 60 * 1000); // 4 hours cache
    res.json({ success: true, data });
  } catch (error) {
    console.error('Test packages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch test packages' });
  }
});

// @route   PUT /api/ward-labs/submit-order
// @desc    Pre-submit sample order to Ward Labs
// @access  Private
router.put('/submit-order', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      // Add integration-specific metadata
      integrationSource: 'Plenterra',
      submittedAt: new Date().toISOString()
    };

    // Call Ward Labs API directly (no caching for submissions)
    const wardLabsAPI = wardLabsCache.wardLabsAPI;
    const response = await wardLabsAPI.put('/orders', orderData);

    res.json({
      success: true,
      message: 'Order submitted to Ward Labs successfully',
      wardLabsOrderNumber: response.data.orderNumber,
      data: response.data
    });

  } catch (error) {
    console.error('Order submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit order to Ward Labs',
      error: error.response?.data || error.message
    });
  }
});

// @route   GET /api/ward-labs/orders/:orderNumber
// @desc    Get order status and results
// @access  Private
router.get('/orders/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    // Poll for results (cache for 15 minutes as recommended)
    const data = await wardLabsCache.get(`/orders/${orderNumber}`, 15 * 60 * 1000);
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Order retrieval error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
});

// =====================================================
// INBOUND: Services Ward Labs calls (your webhooks)
// =====================================================

// @route   POST /api/ward-labs/webhooks/sample-metadata
// @desc    Webhook: Ward Labs requests sample metadata when samples arrive
// @access  Public (Ward Labs calls this)
router.post('/webhooks/sample-metadata', async (req, res) => {
  try {
    const { sampleId, barcode, additionalInfo } = req.body;
    
    console.log(`📦 Ward Labs requesting metadata for sample: ${sampleId}`);
    
    // Look up sample in your system using sampleId/barcode
    // This could be linked to a Plenterra user's field sample
    
    // Example metadata response structure
    const sampleMetadata = {
      growerInfo: {
        name: "Demo Farmer",
        email: "demo@plenterra.com",
        phone: "555-0123",
        address: {
          street: "123 Farm Road",
          city: "Farm City",
          state: "IA", 
          zip: "50001"
        }
      },
      fieldInfo: {
        fieldName: "North Field",
        acres: 60,
        crop: "Corn",
        previousCrop: "Soybeans",
        coordinates: {
          latitude: 41.8781,
          longitude: -93.0977
        }
      },
      sampleInfo: {
        sampleType: "S", // Soil
        depthInches: 8,
        collectionDate: "2025-11-06",
        collectionMethod: "Grid sampling"
      },
      testRequirements: [
        "Standard Soil Test",
        "Organic Matter",
        "Micronutrients"
      ],
      billingInfo: {
        billTo: "grower", // or "dealer"
        poNumber: "PLT-2025-001"
      }
    };
    
    res.json(sampleMetadata);
    
  } catch (error) {
    console.error('Sample metadata webhook error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to provide sample metadata' 
    });
  }
});

// @route   POST /api/ward-labs/webhooks/sample-received
// @desc    Webhook: Ward Labs notifies when sample is physically received
// @access  Public (Ward Labs calls this)
router.post('/webhooks/sample-received', async (req, res) => {
  try {
    const { sampleId, wardLabNumber, status, receivedAt } = req.body;
    
    console.log(`📥 Sample ${sampleId} received at Ward Labs with lab number: ${wardLabNumber}`);
    
    // Update your internal tracking system
    // You could update user's sample status in your database
    
    res.json({ 
      success: true, 
      message: 'Sample receipt notification processed' 
    });
    
  } catch (error) {
    console.error('Sample receipt webhook error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process sample receipt notification' 
    });
  }
});

// @route   POST /api/ward-labs/webhooks/results-delivery
// @desc    Webhook: Ward Labs delivers completed test results
// @access  Public (Ward Labs calls this)
router.post('/webhooks/results-delivery', async (req, res) => {
  try {
    const { 
      orderNumber, 
      wardLabNumber, 
      sampleId, 
      testResults, 
      reports, 
      invoiceInfo,
      completedAt 
    } = req.body;
    
    console.log(`🧪 Test results received for sample: ${sampleId}`);
    
    // Process the results
    // - Store in your database
    // - Calculate soil health scores
    // - Generate recommendations
    // - Notify the farmer
    
    // Example: Update farmer's field data with results
    // const user = findUser(u => u.samples?.some(s => s.id === sampleId));
    // if (user) {
    //   // Update user's field health scores, recommendations, etc.
    // }
    
    res.json({ 
      success: true, 
      message: 'Test results processed successfully' 
    });
    
  } catch (error) {
    console.error('Results delivery webhook error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process test results' 
    });
  }
});

module.exports = router;
