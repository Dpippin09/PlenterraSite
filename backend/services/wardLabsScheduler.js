const cron = require('node-cron');
const wardLabsCache = require('./wardLabsCache');

class WardLabsScheduler {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  // Start all scheduled jobs
  start() {
    if (this.isRunning) return;

    console.log('📅 Starting Ward Labs data scheduler...');

    // Update sample types every hour
    this.jobs.set('sample-types', cron.schedule('0 * * * *', async () => {
      try {
        console.log('🔄 Scheduled update: sample-types');
        await wardLabsCache.get('/sample-types');
      } catch (error) {
        console.error('❌ Scheduled update failed for sample-types:', error.message);
      }
    }));

    // Update other data every 30 minutes
    this.jobs.set('general-data', cron.schedule('*/30 * * * *', async () => {
      try {
        console.log('🔄 Scheduled update: general Ward Labs data');
        // Add other endpoints you want to keep fresh
        // await wardLabsCache.get('/laboratories');
        // await wardLabsCache.get('/test-packages');
      } catch (error) {
        console.error('❌ Scheduled update failed for general data:', error.message);
      }
    }));

    // Clear old cache entries daily at 2 AM
    this.jobs.set('cleanup', cron.schedule('0 2 * * *', () => {
      console.log('🧹 Daily cache cleanup');
      wardLabsCache.clear();
    }));

    this.isRunning = true;
    console.log('✅ Ward Labs scheduler started');
  }

  // Stop all scheduled jobs
  stop() {
    console.log('⏹️  Stopping Ward Labs scheduler...');
    
    for (const [name, job] of this.jobs) {
      job.destroy();
      console.log(`✅ Stopped job: ${name}`);
    }
    
    this.jobs.clear();
    this.isRunning = false;
    console.log('✅ Ward Labs scheduler stopped');
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: Array.from(this.jobs.keys()),
      cacheStats: wardLabsCache.getStats()
    };
  }
}

// Export singleton instance
module.exports = new WardLabsScheduler();
