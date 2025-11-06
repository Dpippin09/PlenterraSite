const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');

// =====================================================
// WARD LABS WEBHOOKS - Public endpoints Ward Labs calls
// =====================================================

// @route   POST /api/webhooks/ward-labs/sample-metadata
// @desc    Ward Labs requests sample metadata when samples arrive
// @access  Public (Ward Labs calls this)
router.post('/sample-metadata', async (req, res) => {
  try {
    const { sampleId, barcode, orderNumber, additionalInfo } = req.body;
    
    console.log(`📦 Ward Labs requesting metadata for sample: ${sampleId}`, {
      barcode,
      orderNumber,
      additionalInfo
    });
    
    // Parse the sampleId to find the associated user and field
    // Format: "plenterra-{userId}-{fieldId}-{timestamp}"
    const sampleParts = sampleId.split('-');
    
    if (sampleParts[0] !== 'plenterra' || sampleParts.length < 4) {
      return res.status(400).json({
        error: 'Invalid sample ID format',
        message: 'Sample ID must be in format: plenterra-{userId}-{fieldId}-{timestamp}'
      });
    }
    
    const userId = sampleParts[1];
    const fieldId = sampleParts[2];
    
    // Find the user and field
    const user = await UserService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user found for sample ID: ${sampleId}`
      });
    }
    
    const field = user.fields?.find(f => f.id === fieldId);
    if (!field) {
      return res.status(404).json({
        error: 'Field not found',
        message: `No field found for sample ID: ${sampleId}`
      });
    }
    
    // Build comprehensive sample metadata for Ward Labs
    const sampleMetadata = {
      // Grower Information
      growerInfo: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '555-0123', // Default if not provided
        company: user.farmName,
        address: {
          street: user.address?.street || '123 Farm Road',
          city: user.address?.city || 'Farm City',
          state: user.address?.state || 'IA',
          zip: user.address?.zip || '50001'
        }
      },
      
      // Field Information
      fieldInfo: {
        fieldName: field.name,
        acres: field.size,
        crop: field.crop,
        previousCrop: field.previousCrop || 'Unknown',
        soilType: field.soilType,
        coordinates: {
          latitude: field.coordinates?.latitude || 41.8781,
          longitude: field.coordinates?.longitude || -93.0977
        },
        managementZone: field.managementZone || 'Default'
      },
      
      // Sample Information
      sampleInfo: {
        sampleType: 'S', // Soil
        depthInches: field.sampleDepth || 8,
        collectionDate: field.lastSampleDate || new Date().toISOString().split('T')[0],
        collectionMethod: field.samplingMethod || 'Grid sampling',
        samplingDensity: field.samplingDensity || '1 sample per 2.5 acres',
        notes: field.sampleNotes || `Plenterra sample from ${field.name}`
      },
      
      // Test Requirements
      testRequirements: field.requestedTests || [
        'Standard Soil Test',
        'Organic Matter',
        'Micronutrients',
        'pH and Buffer pH',
        'Soluble Salts'
      ],
      
      // Billing Information
      billingInfo: {
        billTo: user.billingPreference || 'grower',
        poNumber: `PLT-${new Date().getFullYear()}-${userId.slice(-4)}`,
        customerNumber: user.wardLabsCustomerNumber || null,
        paymentTerms: 'Net 30'
      },
      
      // Integration Metadata
      integrationInfo: {
        source: 'Plenterra Platform',
        platformUserId: userId,
        fieldId: fieldId,
        submissionTimestamp: new Date().toISOString(),
        priority: field.rushOrder ? 'Rush' : 'Standard'
      }
    };
    
    console.log(`✅ Returning metadata for ${user.farmName} - ${field.name}`);
    
    res.json(sampleMetadata);
    
  } catch (error) {
    console.error('Sample metadata webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to provide sample metadata' 
    });
  }
});

// @route   POST /api/webhooks/ward-labs/sample-received
// @desc    Ward Labs notifies when sample is physically received
// @access  Public (Ward Labs calls this)
router.post('/sample-received', async (req, res) => {
  try {
    const { 
      sampleId, 
      wardLabNumber, 
      status, 
      receivedAt,
      orderNumber,
      qualityCheck 
    } = req.body;
    
    console.log(`📥 Sample received notification:`, {
      sampleId,
      wardLabNumber,
      status,
      receivedAt
    });
    
    // Parse sample ID to find user and field
    const sampleParts = sampleId.split('-');
    if (sampleParts[0] === 'plenterra' && sampleParts.length >= 4) {
      const userId = sampleParts[1];
      const fieldId = sampleParts[2];
      
      // Find and update user's sample tracking
      const user = await UserService.findUserById(userId);
      if (user) {
        
        // Initialize samples array if it doesn't exist
        if (!user.samples) {
          user.samples = [];
        }
        
        // Update or create sample record
        const existingSampleIndex = user.samples.findIndex(s => s.sampleId === sampleId);
        
        const sampleRecord = {
          sampleId,
          wardLabNumber,
          fieldId,
          status: 'received',
          submittedAt: user.samples[existingSampleIndex]?.submittedAt || new Date().toISOString(),
          receivedAt,
          orderNumber,
          qualityCheck: qualityCheck || 'Passed',
          notifications: [
            ...(user.samples[existingSampleIndex]?.notifications || []),
            {
              type: 'received',
              message: `Sample received at Ward Labs with lab number: ${wardLabNumber}`,
              timestamp: new Date().toISOString()
            }
          ]
        };
        
        if (existingSampleIndex !== -1) {
          user.samples[existingSampleIndex] = sampleRecord;
        } else {
          user.samples.push(sampleRecord);
        }
        
        // Update the user record
        await UserService.updateUser(userId, { samples: user.samples });
        
        console.log(`✅ Updated sample tracking for user ${userId}`);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Sample receipt notification processed',
      wardLabNumber,
      status: 'acknowledged'
    });
    
  } catch (error) {
    console.error('Sample receipt webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process sample receipt notification' 
    });
  }
});

// @route   POST /api/webhooks/ward-labs/results-delivery
// @desc    Ward Labs delivers completed test results
// @access  Public (Ward Labs calls this)
router.post('/results-delivery', async (req, res) => {
  try {
    const { 
      orderNumber,
      wardLabNumber,
      sampleId,
      testResults,
      reports,
      invoiceInfo,
      completedAt,
      qualityFlags
    } = req.body;
    
    console.log(`🧪 Test results received:`, {
      sampleId,
      wardLabNumber,
      completedAt,
      testCount: testResults?.length || 0
    });
    
    // Parse sample ID to find user and field
    const sampleParts = sampleId.split('-');
    if (sampleParts[0] === 'plenterra' && sampleParts.length >= 4) {
      const userId = sampleParts[1];
      const fieldId = sampleParts[2];
      
      const user = await UserService.findUserById(userId);
      if (user) {
        
        // Initialize samples array if needed
        if (!user.samples) {
          user.samples = [];
        }
        
        // Find the sample record
        const sampleIndex = user.samples.findIndex(s => s.sampleId === sampleId);
        
        if (sampleIndex !== -1) {
          // Update sample with results
          user.samples[sampleIndex] = {
            ...user.samples[sampleIndex],
            status: 'completed',
            completedAt,
            testResults,
            reports,
            invoiceInfo,
            qualityFlags,
            notifications: [
              ...user.samples[sampleIndex].notifications,
              {
                type: 'completed',
                message: `Test results are ready for ${user.samples[sampleIndex].fieldId}`,
                timestamp: new Date().toISOString()
              }
            ]
          };
          
          // Update field health score based on results
          const field = user.fields?.find(f => f.id === fieldId);
          if (field && testResults) {
            // Calculate new health score from test results
            const newHealthScore = calculateSoilHealthScore(testResults);
            
            const fieldIndex = user.fields.findIndex(f => f.id === fieldId);
            if (fieldIndex !== -1) {
              user.fields[fieldIndex] = {
                ...field,
                healthScore: newHealthScore,
                lastTestDate: completedAt,
                lastResults: testResults
              };
            }
            
            // Update overall user stats
            const avgHealthScore = user.fields.reduce((acc, f) => acc + f.healthScore, 0) / user.fields.length;
            user.stats = {
              ...user.stats,
              soilHealthScore: Math.round(avgHealthScore * 10) / 10
            };
          }
          
          // Update the user record
          await UserService.updateUser(userId, { 
            samples: user.samples, 
            fields: user.fields,
            stats: user.stats
          });
          
          console.log(`✅ Processed test results for ${user.farmName} - Field: ${fieldId}`);
        }
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Test results processed successfully',
      wardLabNumber,
      sampleId,
      status: 'processed'
    });
    
  } catch (error) {
    console.error('Results delivery webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process test results' 
    });
  }
});

// Helper function to calculate soil health score from test results
function calculateSoilHealthScore(testResults) {
  try {
    let score = 5.0; // Base score
    
    // Find key indicators and adjust score
    testResults.forEach(result => {
      const { testName, value, units, optimalRange } = result;
      
      switch (testName.toLowerCase()) {
        case 'ph':
        case 'soil ph 1:1':
          // pH scoring: optimal 6.0-7.0
          if (value >= 6.0 && value <= 7.0) score += 1.5;
          else if (value >= 5.5 && value <= 7.5) score += 0.5;
          else score -= 0.5;
          break;
          
        case 'organic matter':
        case 'organic matter loi':
          // Organic matter: higher is better
          if (value >= 4.0) score += 2.0;
          else if (value >= 3.0) score += 1.0;
          else if (value >= 2.0) score += 0.5;
          else score -= 0.5;
          break;
          
        case 'phosphorus':
        case 'phosphorus m3':
          // Phosphorus: optimal range varies
          if (value >= 30 && value <= 50) score += 1.0;
          else if (value >= 20 && value <= 60) score += 0.5;
          break;
          
        case 'potassium':
        case 'potassium nh4oac':
          // Potassium scoring
          if (value >= 150 && value <= 300) score += 1.0;
          else if (value >= 100 && value <= 400) score += 0.5;
          break;
      }
    });
    
    // Cap the score between 1.0 and 10.0
    return Math.max(1.0, Math.min(10.0, score));
    
  } catch (error) {
    console.error('Error calculating soil health score:', error);
    return 6.0; // Default score if calculation fails
  }
}

module.exports = router;
