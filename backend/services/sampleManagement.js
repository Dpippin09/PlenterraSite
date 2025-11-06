const UserService = require('./userService');

class SampleManagementService {
  
  // Generate a unique sample ID for Plenterra platform
  static generateSampleId(userId, fieldId) {
    const timestamp = Date.now();
    return `plenterra-${userId}-${fieldId}-${timestamp}`;
  }
  
  // Generate barcode for physical sample container
  static generateBarcode(sampleId) {
    // Convert sample ID to a barcode-friendly format
    // In production, use a proper barcode generation library
    return sampleId.toUpperCase().replace(/-/g, '');
  }
  
  // Submit a sample for testing
  static async submitSample(userId, fieldId, testRequirements = []) {
    try {
      const user = await UserService.findUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const field = user.fields?.find(f => f.id === fieldId);
      if (!field) {
        throw new Error('Field not found');
      }
      
      // Generate sample identifiers
      const sampleId = this.generateSampleId(userId, fieldId);
      const barcode = this.generateBarcode(sampleId);
      
      // Create sample record with minimal structure for testing
      const sampleRecord = {
        sampleId,
        barcode,
        fieldId,
        fieldName: field.name,
        status: 'prepared',
        testRequirements: testRequirements.length > 0 ? testRequirements : [
          'Standard Soil Test',
          'Organic Matter'
        ],
        submittedAt: new Date(),
        estimatedCompletionDate: new Date(this.calculateEstimatedCompletion()),
        notifications: []
      };
      
      // Update user with sample record using MongoDB $push operation
      const updatedUser = await UserService.findUserById(userId);
      if (!updatedUser) {
        throw new Error('User not found when updating samples');
      }
      
      // Use MongoDB $push to add sample to array
      const User = require('../models/User');
      await User.findByIdAndUpdate(
        userId,
        { $push: { samples: sampleRecord } },
        { new: true }
      );
      
      return {
        success: true,
        sampleId,
        barcode,
        message: 'Sample prepared successfully',
        instructions: {
          barcode,
          sampleId,
          shippingAddress: this.getShippingAddress(),
          instructions: [
            '1. Print the barcode label and attach to sample container',
            '2. Collect soil sample from the designated field area',
            '3. Fill container with approximately 1 cup of soil',
            '4. Ship to Ward Laboratories with barcode clearly visible'
          ]
        }
      };
      
    } catch (error) {
      console.error('Sample submission error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Calculate estimated completion date (typically 7-10 business days)
  static calculateEstimatedCompletion() {
    const date = new Date();
    // Add 7 business days (skip weekends)
    let daysAdded = 0;
    while (daysAdded < 7) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Not Sunday (0) or Saturday (6)
        daysAdded++;
      }
    }
    return date.toISOString();
  }
  
  // Get Ward Labs shipping address
  static getShippingAddress() {
    return {
      name: 'Ward Laboratories, Inc.',
      address: '4007 Cherry Ave',
      city: 'Kearney',
      state: 'NE',
      zip: '68847',
      phone: '(308) 234-2418',
      instructions: 'Mark package as "Soil Analysis - Plenterra Platform"'
    };
  }
  
  // Get sample status for a user
  static async getSampleStatus(userId, sampleId = null) {
    try {
      const user = await UserService.findUserById(userId);
      if (!user || !user.samples) {
        return { success: false, message: 'No samples found' };
      }
      
      if (sampleId) {
        const sample = user.samples.find(s => s.sampleId === sampleId);
        return sample 
          ? { success: true, sample }
          : { success: false, message: 'Sample not found' };
      }
      
      return {
        success: true,
        samples: user.samples.map(sample => ({
          sampleId: sample.sampleId,
          fieldName: sample.fieldName,
          status: sample.status,
          submittedAt: sample.submittedAt,
          wardLabNumber: sample.wardLabNumber,
          estimatedCompletion: sample.estimatedCompletionDate
        }))
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Get available test packages (from Ward Labs cache)
  static async getTestPackages() {
    try {
      const wardLabsCache = require('./wardLabsCache');
      const testPackages = await wardLabsCache.get('/test-packages', 4 * 60 * 60 * 1000); // 4 hour cache
      
      // Filter for soil test packages and format for UI
      if (testPackages && testPackages.data && Array.isArray(testPackages.data)) {
        return testPackages.data
          .filter(pkg => pkg.sampleTypeName === 'Soil')
          .map(pkg => ({
            id: pkg.testPackageId,
            name: pkg.testPackageName,
            price: pkg.price,
            tests: pkg.tests,
            description: `${pkg.tests.length} tests included`
          }))
          .sort((a, b) => a.price - b.price);
      }
      
      return [];
        
    } catch (error) {
      console.error('Error fetching test packages:', error);
      return [];
    }
  }
}

module.exports = SampleManagementService;
