
class FacebookRateLimit {
  constructor() {
    this.requestQueue = new Map();
    this.lastRequestTime = 0;
    this.MIN_DELAY = 6000; // Increased to 6 seconds
    this.BLOCKED_DELAY = 180000; // 3 minutes when blocked
    this.isBlocked = false;
    this.blockUntil = 0;
    this.requestCount = 0;
    this.resetTime = Date.now() + 3600000; // Reset every hour
    this.MAX_REQUESTS_PER_HOUR = 400; // Reduced limit
    this.consecutiveErrors = 0;
    this.userInfoCache = new Map();
    this.CACHE_DURATION = 900000; // 15 minutes cache
  }

  async throttleRequest(requestType = 'default') {
    const now = Date.now();
    
    // Reset hourly counter
    if (now > this.resetTime) {
      this.requestCount = 0;
      this.resetTime = now + 3600000;
      this.consecutiveErrors = 0;
    }
    
    // Check hourly limit
    if (this.requestCount >= this.MAX_REQUESTS_PER_HOUR) {
      const waitTime = this.resetTime - now;
      console.log(`Hourly rate limit reached, waiting ${Math.round(waitTime/1000)}s`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.resetTime = Date.now() + 3600000;
    }
    
    // Check if we're still in a blocked state
    if (this.isBlocked && now < this.blockUntil) {
      const waitTime = this.blockUntil - now;
      console.log(`Facebook rate limit active, waiting ${Math.round(waitTime/1000)}s`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.isBlocked = false;
    }

    // Apply progressive delay based on errors
    const progressiveDelay = this.MIN_DELAY * Math.pow(1.5, this.consecutiveErrors);
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < progressiveDelay) {
      const waitTime = progressiveDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  handleRateLimit() {
    this.isBlocked = true;
    this.consecutiveErrors++;
    this.blockUntil = Date.now() + this.BLOCKED_DELAY;
    console.log(`Facebook rate limit detected (${this.consecutiveErrors} consecutive), blocking for ${this.BLOCKED_DELAY/1000}s`);
  }

  async safeGetUserInfo(api, userIds) {
    const now = Date.now();
    const idsArray = Array.isArray(userIds) ? userIds : [userIds];
    const cachedResults = {};
    const uncachedIds = [];

    // Check cache first
    for (const id of idsArray) {
      const cached = this.userInfoCache.get(id);
      if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
        cachedResults[id] = cached.data;
      } else {
        uncachedIds.push(id);
      }
    }

    // Return cached if all available
    if (uncachedIds.length === 0) {
      return cachedResults;
    }

    // If blocked or near limit, return cached + fallback
    if (this.isBlocked || this.requestCount >= this.MAX_REQUESTS_PER_HOUR * 0.9) {
      const fallbackData = { ...cachedResults };
      uncachedIds.forEach(id => {
        fallbackData[id] = {
          name: `User-${id.slice(-6)}`,
          firstName: "Unknown",
          vanity: "",
          thumbSrc: `https://graph.facebook.com/${id}/picture?type=large`,
          profileUrl: `https://facebook.com/${id}`,
          gender: 0,
          type: "user",
          isFriend: false,
          isBirthday: false,
          searchTokens: [],
          alternateName: ""
        };
      });
      return fallbackData;
    }

    await this.throttleRequest('getUserInfo');
    
    return new Promise((resolve, reject) => {
      api.getUserInfo(uncachedIds.slice(0, 3), (err, data) => { // Limit to 3 users per request
        if (err) {
          if (err.error === 3252001) {
            this.handleRateLimit();
            // Return cached + fallback data instead of error
            const fallbackData = { ...cachedResults };
            uncachedIds.forEach(id => {
              fallbackData[id] = {
                name: `User-${id.slice(-6)}`,
                firstName: "Unknown",
                vanity: "",
                thumbSrc: `https://graph.facebook.com/${id}/picture?type=large`,
                profileUrl: `https://facebook.com/${id}`,
                gender: 0,
                type: "user",
                isFriend: false,
                isBirthday: false,
                searchTokens: [],
                alternateName: ""
              };
            });
            resolve(fallbackData);
          } else {
            reject(err);
          }
        } else {
          // Cache successful results
          if (data) {
            for (const id in data) {
              this.userInfoCache.set(id, {
                data: data[id],
                timestamp: now
              });
            }
          }
          // Reset consecutive errors on success
          this.consecutiveErrors = Math.max(0, this.consecutiveErrors - 1);
          
          resolve({ ...cachedResults, ...data });
        }
      });
    });
  }

  // Batch processing with enhanced rate limiting
  async batchProcessUserInfo(api, userIds, batchSize = 2) {
    const results = {};
    const batches = [];
    
    // Split into very small batches
    for (let i = 0; i < userIds.length; i += batchSize) {
      batches.push(userIds.slice(i, i + batchSize));
    }
    
    // Process batches with longer delays
    for (const batch of batches) {
      try {
        const batchResult = await this.safeGetUserInfo(api, batch);
        Object.assign(results, batchResult);
        
        // Add longer delay between batches
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      } catch (error) {
        console.log(`Batch processing failed for ${batch}, using fallback`);
        // Add fallback data for failed batch
        batch.forEach(id => {
          results[id] = {
            name: `User-${id.slice(-6)}`,
            firstName: "Unknown",
            vanity: "",
            thumbSrc: `https://graph.facebook.com/${id}/picture?type=large`,
            profileUrl: `https://facebook.com/${id}`,
            gender: 0,
            type: "user",
            isFriend: false,
            isBirthday: false,
            searchTokens: [],
            alternateName: ""
          };
        });
      }
    }
    
    return results;
  }

  // Clean old cache entries
  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.userInfoCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.userInfoCache.delete(key);
      }
    }
  }
}

module.exports = new FacebookRateLimit();
