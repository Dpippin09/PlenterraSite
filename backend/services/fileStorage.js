const fs = require('fs').promises;
const path = require('path');

class FileStorage {
  constructor() {
    this.filePath = path.join(__dirname, '../data/users.json');
    this.users = [];
    this.loadUsers();
  }

  // Load users from file
  async loadUsers() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.users = JSON.parse(data);
      console.log(`✅ Loaded ${this.users.length} users from file storage`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, start with empty array
        this.users = [];
        await this.initializeDemoAccount();
        await this.saveUsers();
      } else {
        console.error('Error loading users:', error);
      }
    }
  }

  // Save users to file
  async saveUsers() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Initialize demo account (same as before)
  async initializeDemoAccount() {
    if (this.users.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('demo123', 12);
      
      const demoUser = {
        id: 'demo-user-id',
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
            lastTreatment: '2025-10-15T00:00:00.000Z'
          },
          {
            id: 'demo-field-2',
            name: 'South Field',
            size: 40,
            crop: 'Soybeans',
            soilType: 'Clay',
            healthScore: 6.8,
            lastTreatment: '2025-09-20T00:00:00.000Z'
          }
        ],
        samples: [],
        createdAt: '2025-01-01T00:00:00.000Z'
      };

      this.users.push(demoUser);
      console.log('✅ Demo account initialized');
    }
  }

  // Get all users
  getUsers() {
    return this.users;
  }

  // Add user
  async addUser(user) {
    this.users.push(user);
    await this.saveUsers();
    return user;
  }

  // Find user
  findUser(predicate) {
    return this.users.find(predicate);
  }

  // Find user index
  findUserIndex(predicate) {
    return this.users.findIndex(predicate);
  }

  // Update user
  async updateUser(index, updates) {
    if (index >= 0 && index < this.users.length) {
      this.users[index] = { ...this.users[index], ...updates };
      await this.saveUsers();
      return this.users[index];
    }
    return null;
  }
}

// Export singleton instance
module.exports = new FileStorage();
