const axios = require('axios');

class WardLabsCache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    // Configure axios instance for Ward Labs API
    this.wardLabsAPI = axios.create({
      baseURL: process.env.WARD_LABS_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'x-ward-api-key': process.env.WARD_LABS_API_KEY
      }
    });
  }

  // Get data with caching
  async get(endpoint, ttl = this.defaultTTL) {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() < cached.expiry) {
      console.log(`📦 Cache hit for ${endpoint}`);
      return cached.data;
    }

    try {
      // Fetch fresh data from Ward Labs
      console.log(`🌐 Fetching fresh data for ${endpoint}`);
      const response = await this.wardLabsAPI.get(endpoint);
      
      // Cache the response
      this.cache.set(cacheKey, {
        data: response.data,
        expiry: Date.now() + ttl,
        fetchedAt: new Date().toISOString()
      });

      return response.data;

    } catch (error) {
      // If API fails and we have cached data, return it
      if (cached) {
        console.log(`⚠️  API failed, using stale cache for ${endpoint}`);
        return cached.data;
      }
      throw error;
    }
  }

  // Clear specific cache entry
  invalidate(endpoint) {
    this.cache.delete(endpoint);
    console.log(`🗑️  Cache cleared for ${endpoint}`);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    console.log('🗑️  All cache cleared');
  }

  // Get cache stats
  getStats() {
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      endpoint: key,
      expiry: new Date(value.expiry).toISOString(),
      fetchedAt: value.fetchedAt,
      isExpired: Date.now() > value.expiry
    }));

    return {
      totalEntries: this.cache.size,
      entries
    };
  }
}

// Export singleton instance
module.exports = new WardLabsCache();
