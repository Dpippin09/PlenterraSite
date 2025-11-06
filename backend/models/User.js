const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  farmName: { type: String, required: true },
  totalAcres: { type: Number, required: true },
  farmingType: { type: String, required: true },
  yearsFarming: { type: Number, default: 1 },
  primaryCrops: { type: String, default: 'Not specified' },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  billingPreference: { type: String, default: 'grower' },
  wardLabsCustomerNumber: String,

  // Farm statistics
  stats: {
    soilHealthScore: { type: Number, default: 6.0 },
    waterRetention: { type: Number, default: 70 },
    carbonSequestered: { type: Number, default: 0 },
    totalCredits: { type: Number, default: 0 }
  },

  // Field information
  fields: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    crop: String,
    previousCrop: String,
    soilType: String,
    healthScore: { type: Number, default: 6.0 },
    lastTreatment: Date,
    lastTestDate: Date,
    lastResults: mongoose.Schema.Types.Mixed,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    managementZone: String,
    sampleDepth: { type: Number, default: 8 },
    lastSampleDate: Date,
    samplingMethod: { type: String, default: 'Grid sampling' },
    samplingDensity: String,
    sampleNotes: String,
    requestedTests: [String],
    rushOrder: { type: Boolean, default: false }
  }],
  
  // Sample tracking
  samples: [{
    sampleId: { type: String, required: true },
    barcode: String,
    fieldId: String,
    fieldName: String,
    status: { 
      type: String, 
      enum: ['prepared', 'submitted', 'received', 'testing', 'completed'],
      default: 'prepared' 
    },
    wardLabNumber: String,
    testRequirements: [String],
    submittedAt: Date,
    receivedAt: Date,
    completedAt: Date,
    estimatedCompletionDate: Date,
    testResults: mongoose.Schema.Types.Mixed,
    reports: mongoose.Schema.Types.Mixed,
    invoiceInfo: mongoose.Schema.Types.Mixed,
    qualityFlags: mongoose.Schema.Types.Mixed,
    notifications: [{
      type: String,
      message: String,
      timestamp: { type: Date, default: Date.now }
    }]
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'samples.sampleId': 1 });

module.exports = mongoose.model('User', userSchema);
