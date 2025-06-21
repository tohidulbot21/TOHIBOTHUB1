
class RateLimitManager {
  constructor() {
    this.messageQueue = [];
    this.isProcessing = false;
    this.lastMessageTime = 0;
    this.MIN_INTERVAL = 8000; // 8 seconds between messages
    this.MAX_QUEUE_SIZE = 50;
    this.consecutiveErrors = 0;
    this.backoffDelay = 0;
    this.isBlocked = false;
    this.blockUntil = 0;
    this.sentMessages = new Map(); // Track recent messages to prevent duplicates
    this.DUPLICATE_WINDOW = 10000; // 10 seconds window for duplicate detection
  }

  async queueMessage(api, threadID, message, options = {}) {
    // Create a unique key for this message
    const messageKey = `${threadID}_${typeof message === 'string' ? message : JSON.stringify(message)}`;
    const now = Date.now();
    
    // Check for recent duplicate
    if (this.sentMessages.has(messageKey)) {
      const lastSent = this.sentMessages.get(messageKey);
      if (now - lastSent < this.DUPLICATE_WINDOW) {
        // Return resolved promise to avoid error, but don't send duplicate
        return Promise.resolve({ messageID: 'duplicate_skipped' });
      }
    }
    
    // Mark this message as being sent
    this.sentMessages.set(messageKey, now);
    
    // Clean old entries
    if (this.sentMessages.size > 100) {
      for (const [key, timestamp] of this.sentMessages.entries()) {
        if (now - timestamp > this.DUPLICATE_WINDOW) {
          this.sentMessages.delete(key);
        }
      }
    }

    // If queue is full, reject oldest messages
    if (this.messageQueue.length >= this.MAX_QUEUE_SIZE) {
      this.messageQueue.shift(); // Remove oldest
    }

    return new Promise((resolve, reject) => {
      this.messageQueue.push({
        api,
        threadID,
        message,
        options,
        resolve,
        reject,
        timestamp: now,
        messageKey
      });

      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.messageQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.messageQueue.length > 0) {
      // Check if we're still blocked
      if (this.isBlocked && Date.now() < this.blockUntil) {
        const waitTime = this.blockUntil - Date.now();
        console.log(`Rate limit active, waiting ${Math.round(waitTime/1000)}s`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.isBlocked = false;
      }

      const now = Date.now();
      const timeSinceLastMessage = now - this.lastMessageTime;
      const requiredDelay = this.MIN_INTERVAL + this.backoffDelay;

      if (timeSinceLastMessage < requiredDelay) {
        const waitTime = requiredDelay - timeSinceLastMessage;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      const messageData = this.messageQueue.shift();
      if (!messageData) break;

      try {
        const result = await this.sendMessageSafely(messageData);
        messageData.resolve(result);
        
        // Reset error count on success
        this.consecutiveErrors = 0;
        this.backoffDelay = 0;
        
      } catch (error) {
        this.handleError(error);
        messageData.reject(error);
      }

      this.lastMessageTime = Date.now();
    }

    this.isProcessing = false;
  }

  async sendMessageSafely(messageData) {
    const { api, threadID, message, options } = messageData;

    return new Promise((resolve, reject) => {
      const callback = (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      };

      if (options.replyTo) {
        api.sendMessage(message, threadID, callback, options.replyTo);
      } else {
        api.sendMessage(message, threadID, callback);
      }
    });
  }

  handleError(error) {
    this.consecutiveErrors++;
    
    // Facebook spam protection
    if (error.error === 1390008) {
      this.isBlocked = true;
      this.blockUntil = Date.now() + (30 * 60 * 1000); // 30 minutes block
      this.backoffDelay = Math.min(60000, this.backoffDelay + 10000); // Increase delay
      console.log('Facebook spam protection activated, blocking for 30 minutes');
    }
    // Other rate limits
    else if (error.error === 3252001 || error.toString().includes('Rate limited')) {
      this.isBlocked = true;
      this.blockUntil = Date.now() + (5 * 60 * 1000); // 5 minutes block
      this.backoffDelay = Math.min(30000, this.backoffDelay + 5000);
      console.log('Rate limit detected, blocking for 5 minutes');
    }
    // Network errors
    else {
      this.backoffDelay = Math.min(20000, this.backoffDelay + 2000);
    }
  }

  // Clean expired messages from queue
  cleanQueue() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    this.messageQueue = this.messageQueue.filter(item => {
      const age = now - item.timestamp;
      if (age > maxAge) {
        item.reject(new Error('Message expired in queue'));
        return false;
      }
      return true;
    });
  }

  startCleaning() {
    setInterval(() => {
      this.cleanQueue();
    }, 60000); // Clean every minute
  }
}

module.exports = new RateLimitManager();
