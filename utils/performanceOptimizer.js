
const fs = require('fs-extra');
const path = require('path');

class PerformanceOptimizer {
  constructor() {
    this.cacheDir = path.join(__dirname, '../modules/commands/cache');
    this.maxCacheSize = 200; // MB
    this.cleanupInterval = 30 * 60 * 1000; // 30 minutes
    this.lastCleanup = Date.now();
  }

  // Clean up old cache files
  async cleanupCache() {
    try {
      if (!await fs.pathExists(this.cacheDir)) {
        return;
      }

      const files = await fs.readdir(this.cacheDir, { withFileTypes: true });
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      for (const file of files) {
        if (file.isFile()) {
          const filePath = path.join(this.cacheDir, file.name);
          const stats = await fs.stat(filePath);
          
          // Delete files older than 24 hours
          if (now - stats.mtime.getTime() > maxAge) {
            await fs.remove(filePath);
            console.log(`Cleaned up old cache file: ${file.name}`);
          }
        }
      }
    } catch (error) {
      console.log('Cache cleanup error:', error.message);
    }
  }

  // Monitor memory usage and trigger cleanup if needed
  async monitorMemory() {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    
    // If heap usage > 400MB, trigger cleanup
    if (heapUsedMB > 400) {
      console.log(`High memory usage detected: ${heapUsedMB.toFixed(2)}MB`);
      
      // Force garbage collection if available
      if (global.gc && typeof global.gc === 'function') {
        global.gc();
        console.log('Forced garbage collection');
      }
      
      // Clean cache if memory is still high
      await this.cleanupCache();
    }
  }

  // Optimize command execution environment
  async optimizeExecution() {
    // Check if cleanup is needed
    const now = Date.now();
    if (now - this.lastCleanup > this.cleanupInterval) {
      await this.cleanupCache();
      await this.monitorMemory();
      this.lastCleanup = now;
    }
  }

  // Clean up specific command cache
  async cleanCommandCache(commandName) {
    try {
      const commandCacheDir = path.join(this.cacheDir, commandName);
      if (await fs.pathExists(commandCacheDir)) {
        await fs.emptyDir(commandCacheDir);
        console.log(`Cleaned cache for command: ${commandName}`);
      }
    } catch (error) {
      console.log(`Error cleaning ${commandName} cache:`, error.message);
    }
  }

  // Start automatic optimization
  startAutoOptimization() {
    setInterval(async () => {
      await this.optimizeExecution();
    }, this.cleanupInterval);
    
    console.log('Performance optimizer started');
  }
}

module.exports = new PerformanceOptimizer();
