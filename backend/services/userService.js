const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  
  // Initialize demo account in MongoDB
  static async initializeDemoAccount() {
    try {
      // Check if demo user already exists
      const existingDemo = await User.findOne({ username: 'demo' });
      if (existingDemo) {
        console.log('✅ Demo account already exists in MongoDB');
        return existingDemo;
      }

      const hashedPassword = await bcrypt.hash('demo123', 12);
      
      const demoUser = new User({
        firstName: 'Demo',
        lastName: 'Farmer',
        email: 'demo@plenterra.com',
        username: 'demo',
        password: hashedPassword,
        farmName: 'Demo Farm',
        totalAcres: 100,
        farmingType: 'Grain',
        yearsFarming: 5,
        primaryCrops: 'Corn, Soybeans',
        stats: {
          soilHealthScore: 7.2,
          waterRetention: 75,
          carbonSequestered: 2.5,
          totalCredits: 120
        },
        fields: [
          {
            id: 'demo-field-1',
            name: 'North Field',
            size: 60,
            crop: 'Corn',
            soilType: 'Loamy',
            healthScore: 7.5,
            lastTreatment: new Date('2025-10-15T00:00:00.000Z')
          },
          {
            id: 'demo-field-2',
            name: 'South Field',
            size: 40,
            crop: 'Soybeans',
            soilType: 'Clay',
            healthScore: 6.8,
            lastTreatment: new Date('2025-09-20T00:00:00.000Z')
          }
        ],
        samples: []
      });

      await demoUser.save();
      console.log('✅ Demo account created in MongoDB');
      return demoUser;
      
    } catch (error) {
      console.error('❌ Error initializing demo account:', error);
      throw error;
    }
  }

  // Get all users
  static async getUsers() {
    try {
      return await User.find().select('-password');
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Add new user
  static async addUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  // Find user by condition
  static async findUser(conditions) {
    try {
      return await User.findOne(conditions);
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findUserById(userId) {
    try {
      return await User.findById(userId).select('-password');
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(userId, updates) {
    try {
      const user = await User.findByIdAndUpdate(
        userId, 
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-password');
      
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Authentication methods
  static async authenticateUser(usernameOrEmail, password) {
    try {
      const user = await User.findOne({
        $or: [
          { username: usernameOrEmail.toLowerCase() },
          { email: usernameOrEmail.toLowerCase() }
        ]
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
      
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  // Sample management methods
  static async addSampleToUser(userId, sampleData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.samples.push(sampleData);
      await user.save();
      return user;
      
    } catch (error) {
      console.error('Error adding sample to user:', error);
      throw error;
    }
  }

  static async updateSample(userId, sampleId, updates) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const sample = user.samples.id(sampleId);
      if (!sample) {
        throw new Error('Sample not found');
      }

      Object.assign(sample, updates);
      await user.save();
      return user;
      
    } catch (error) {
      console.error('Error updating sample:', error);
      throw error;
    }
  }

  static async findUserBySampleId(sampleId) {
    try {
      return await User.findOne({ 'samples.sampleId': sampleId });
    } catch (error) {
      console.error('Error finding user by sample ID:', error);
      throw error;
    }
  }

  // Field management
  static async addFieldToUser(userId, fieldData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.fields.push(fieldData);
      await user.save();
      return user;
      
    } catch (error) {
      console.error('Error adding field to user:', error);
      throw error;
    }
  }

  static async updateField(userId, fieldId, updates) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const field = user.fields.find(f => f.id === fieldId);
      if (!field) {
        throw new Error('Field not found');
      }

      Object.assign(field, updates);
      await user.save();
      return user;
      
    } catch (error) {
      console.error('Error updating field:', error);
      throw error;
    }
  }

  // Statistics
  static async getUserCount() {
    try {
      return await User.countDocuments();
    } catch (error) {
      console.error('Error getting user count:', error);
      throw error;
    }
  }

  static async getSampleCount() {
    try {
      const result = await User.aggregate([
        { $unwind: '$samples' },
        { $count: 'totalSamples' }
      ]);
      return result[0]?.totalSamples || 0;
    } catch (error) {
      console.error('Error getting sample count:', error);
      throw error;
    }
  }
}

module.exports = UserService;
