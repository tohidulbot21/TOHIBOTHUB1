
const fs = require('fs-extra');
const path = require('path');

class CommandRecovery {
  constructor() {
    this.failedCommands = new Map();
    this.recoveryAttempts = new Map();
    this.maxRecoveryAttempts = 3;
    this.recoveryDelay = 5000; // 5 seconds
  }

  // Record a failed command
  recordFailure(commandName, error, context = {}) {
    const key = `${commandName}_${context.threadID || 'unknown'}`;
    const failures = this.failedCommands.get(key) || [];
    
    failures.push({
      timestamp: Date.now(),
      error: error.message || error.toString(),
      context
    });
    
    // Keep only last 10 failures
    if (failures.length > 10) {
      failures.shift();
    }
    
    this.failedCommands.set(key, failures);
  }

  // Check if command should be recovered
  shouldRecover(commandName, context = {}) {
    const key = `${commandName}_${context.threadID || 'unknown'}`;
    const attempts = this.recoveryAttempts.get(key) || 0;
    
    return attempts < this.maxRecoveryAttempts;
  }

  // Attempt to recover a command
  async attemptRecovery(commandName, originalFunction, context = {}) {
    const key = `${commandName}_${context.threadID || 'unknown'}`;
    const attempts = this.recoveryAttempts.get(key) || 0;
    
    if (attempts >= this.maxRecoveryAttempts) {
      throw new Error(`Max recovery attempts reached for ${commandName}`);
    }

    this.recoveryAttempts.set(key, attempts + 1);
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, this.recoveryDelay * attempts));
    
    try {
      // Clean up command-specific resources
      await this.cleanupCommandResources(commandName);
      
      // Retry the command
      const result = await originalFunction();
      
      // Reset recovery attempts on success
      this.recoveryAttempts.delete(key);
      
      return result;
    } catch (error) {
      this.recordFailure(commandName, error, context);
      throw error;
    }
  }

  // Clean up command-specific resources
  async cleanupCommandResources(commandName) {
    try {
      // Clean command cache
      const cacheDir = path.join(__dirname, '../modules/commands/cache');
      const commandCache = path.join(cacheDir, commandName);
      
      if (await fs.pathExists(commandCache)) {
        const files = await fs.readdir(commandCache);
        
        // Remove old files (older than 1 hour)
        const now = Date.now();
        const maxAge = 60 * 60 * 1000; // 1 hour
        
        for (const file of files) {
          const filePath = path.join(commandCache, file);
          const stats = await fs.stat(filePath);
          
          if (now - stats.mtime.getTime() > maxAge) {
            await fs.remove(filePath);
          }
        }
      }
      
      // Force garbage collection
      if (global.gc && typeof global.gc === 'function') {
        global.gc();
      }
      
    } catch (error) {
      console.log(`Cleanup error for ${commandName}:`, error.message);
    }
  }

  // Get recovery statistics
  getRecoveryStats() {
    const stats = {
      totalFailedCommands: this.failedCommands.size,
      totalRecoveryAttempts: Array.from(this.recoveryAttempts.values()).reduce((a, b) => a + b, 0),
      commandFailures: {}
    };
    
    for (const [key, failures] of this.failedCommands.entries()) {
      const commandName = key.split('_')[0];
      if (!stats.commandFailures[commandName]) {
        stats.commandFailures[commandName] = 0;
      }
      stats.commandFailures[commandName] += failures.length;
    }
    
    return stats;
  }

  // Clean old recovery data
  cleanOldData() {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    // Clean failed commands
    for (const [key, failures] of this.failedCommands.entries()) {
      const recentFailures = failures.filter(f => now - f.timestamp < maxAge);
      if (recentFailures.length === 0) {
        this.failedCommands.delete(key);
      } else {
        this.failedCommands.set(key, recentFailures);
      }
    }
    
    // Clean recovery attempts
    for (const [key] of this.recoveryAttempts.entries()) {
      const lastFailure = this.failedCommands.get(key);
      if (!lastFailure || lastFailure.length === 0) {
        this.recoveryAttempts.delete(key);
      }
    }
  }

  // Start automatic cleanup
  startAutoCleanup() {
    setInterval(() => {
      this.cleanOldData();
    }, 10 * 60 * 1000); // Every 10 minutes
    
    console.log('Command recovery system started');
  }
}

module.exports = new CommandRecovery();
