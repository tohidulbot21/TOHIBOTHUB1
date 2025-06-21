// API Helper utilities for rate limiting and error handling
const logger = require('./log.js');

class APIHelper {
  constructor() {
    this.lastCallTime = 0;
    this.minDelay = 1000; // Minimum 1 second between API calls
  }

  // Add delay between API calls to prevent rate limiting
  async rateLimitedCall(apiFunction, ...args) {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;

    if (timeSinceLastCall < this.minDelay) {
      const delayNeeded = this.minDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delayNeeded));
    }

    this.lastCallTime = Date.now();

    try {
      return await apiFunction(...args);
    } catch (error) {
      // Handle rate limiting with exponential backoff
      if (error.message && error.message.includes('Rate limited')) {
        const retryDelay = 2000; // Start with 2 seconds
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return await apiFunction(...args);
      }
      throw error;
    }
  }

  // Wrapper for removeUserFromGroup with rate limiting
  async removeUserFromGroup(api, userID, threadID) {
    return this.rateLimitedCall(
      () => new Promise((resolve, reject) => {
        api.removeUserFromGroup(userID, threadID, (err) => {
          if (err) reject(err);
          else resolve();
        });
      })
    );
  }

  // Wrapper for addUserToGroup with rate limiting  
  async addUserToGroup(api, userID, threadID) {
    return this.rateLimitedCall(
      () => new Promise((resolve, reject) => {
        api.addUserToGroup(userID, threadID, (err, info) => {
          if (err) reject(err);
          else resolve(info);
        });
      })
    );
  }
}

module.exports = new APIHelper();