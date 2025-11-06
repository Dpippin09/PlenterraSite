const bcrypt = require('bcryptjs');

// In-memory user storage (replace with MongoDB in production)
// This will be shared across all routes
let users = [];

// Initialize with demo account
const initializeDemoAccount = async () => {
  if (users.length === 0) {
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
      createdAt: '2025-01-01T00:00:00.000Z'
    };

    users.push(demoUser);
    console.log('✅ Demo account initialized');
  }
};

// Initialize demo account on module load
initializeDemoAccount().catch(console.error);

module.exports = {
  getUsers: () => users,
  addUser: (user) => {
    users.push(user);
    return user;
  },
  findUser: (predicate) => users.find(predicate),
  findUserIndex: (predicate) => users.findIndex(predicate),
  updateUser: (index, updates) => {
    if (index >= 0 && index < users.length) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  }
};
