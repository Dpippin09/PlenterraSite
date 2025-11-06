const mongoose = require('mongoose');
require('dotenv').config();

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plenterra');
    console.log('Connected to MongoDB');
    
    // Drop the entire users collection to remove all indexes
    await mongoose.connection.db.collection('users').drop();
    console.log('Dropped users collection');
    
    await mongoose.disconnect();
    console.log('Database reset complete');
  } catch (error) {
    console.error('Reset error:', error);
    process.exit(1);
  }
}

resetDatabase();
