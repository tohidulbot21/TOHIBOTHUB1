
const fs = require('fs-extra');
const path = require('path');

class SystemHealth {
  constructor() {
    this.healthChecks = [];
    this.lastHealthCheck = Date.now();
    this.healthCheckInterval = 5 * 60 * 1000; // 5 minutes
    this.criticalErrors = [];
  }

  // Add health check
  addHealthCheck(name, checkFunction) {
    this.healthChecks.push({ name, check: checkFunction });
  }

  // Run all health checks
  async runHealthChecks() {
    const results = [];
    
    for (const { name, check } of this.healthChecks) {
      try {
        const result = await check();
        results.push({ name, status: 'healthy', details: result });
      } catch (error) {
        results.push({ name, status: 'unhealthy', error: error.message });
      }
    }
    
    return results;
  }

  // Check system resources
  async checkSystemResources() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      uptime: Math.round(process.uptime()),
      pid: process.pid
    };
  }

  // Check file system
  async checkFileSystem() {
    const cacheDir = path.join(__dirname, '../modules/commands/cache');
    const dataDir = path.join(__dirname, '../includes/database/data');
    
    const checks = {
      cacheDir: await fs.pathExists(cacheDir),
      dataDir: await fs.pathExists(dataDir),
      configFile: await fs.pathExists(path.join(__dirname, '../config.json'))
    };
    
    return checks;
  }

  // Check command system
  async checkCommandSystem() {
    const commandsPath = path.join(__dirname, '../modules/commands');
    const eventsPath = path.join(__dirname, '../modules/events');
    
    const commandFiles = await fs.readdir(commandsPath);
    const eventFiles = await fs.readdir(eventsPath);
    
    return {
      totalCommands: commandFiles.filter(f => f.endsWith('.js')).length,
      totalEvents: eventFiles.filter(f => f.endsWith('.js')).length,
      commandsLoaded: global.client?.commands?.size || 0
    };
  }

  // Initialize default health checks
  initializeHealthChecks() {
    this.addHealthCheck('system_resources', () => this.checkSystemResources());
    this.addHealthCheck('file_system', () => this.checkFileSystem());
    this.addHealthCheck('command_system', () => this.checkCommandSystem());
  }

  // Start health monitoring
  startHealthMonitoring() {
    this.initializeHealthChecks();
    
    setInterval(async () => {
      try {
        const results = await this.runHealthChecks();
        const unhealthy = results.filter(r => r.status === 'unhealthy');
        
        if (unhealthy.length > 0) {
          console.log('Health Check Warning:', unhealthy);
        }
        
        this.lastHealthCheck = Date.now();
      } catch (error) {
        console.log('Health check error:', error.message);
      }
    }, this.healthCheckInterval);
    
    console.log('System health monitoring started');
  }

  // Get health summary
  async getHealthSummary() {
    const results = await this.runHealthChecks();
    const healthy = results.filter(r => r.status === 'healthy').length;
    const total = results.length;
    
    return {
      overall: healthy === total ? 'healthy' : 'degraded',
      score: `${healthy}/${total}`,
      checks: results,
      lastCheck: new Date(this.lastHealthCheck).toISOString()
    };
  }
}

module.exports = new SystemHealth();
