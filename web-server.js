const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/log.js');

class WebServer {
  constructor() {
    this.app = express();
    // Render optimization - use 0.0.0.0 for proper binding
    this.host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    this.port = process.env.PORT || 10000;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.static('includes/cover'));
    this.app.use(express.json());
  }

  setupRoutes() {
    // Serve the main dashboard
    this.app.get('/', (req, res) => {
      try {
        const dashboardPath = path.join(__dirname, 'includes/cover/dashboard.html');
        if (fs.existsSync(dashboardPath)) {
          res.sendFile(dashboardPath);
        } else {
          res.send(`
            <html>
              <head><title>TOHI-BOT-HUB Dashboard</title></head>
              <body>
                <h1>🤖 TOHI-BOT-HUB is Running!</h1>
                <p>Bot is online and ready to serve.</p>
                <p>Dashboard coming soon...</p>
              </body>
            </html>
          `);
        }
      } catch (error) {
        logger.log(`Dashboard error: ${error.message}`, "WEBSERVER");
        res.status(500).send('Server Error');
      }
    });

    // API endpoint for bot status
    this.app.get('/api/status', (req, res) => {
      res.json({
        status: 'online',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        commands: global.client ? global.client.commands.size : 0,
        events: global.client ? global.client.events.size : 0
      });
    });

    // Keep-alive endpoint
    this.app.get('/ping', (req, res) => {
      res.json({ 
        status: 'alive', 
        timestamp: new Date().toISOString() 
      });
    });
  }

  start() {
    this.setupRoutes();

    // Add health check endpoint for Render
    this.app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'TOHI-BOT-HUB'
      });
    });

    this.server = this.app.listen(this.port, this.host, () => {
      logger.log(`Web server running on ${this.host}:${this.port}`, "WEBSERVER");

      if (process.env.RENDER_EXTERNAL_URL) {
        logger.log(`Dashboard: ${process.env.RENDER_EXTERNAL_URL}/dashboard`, "WEBSERVER");
      } else {
        logger.log(`Dashboard: http://${this.host}:${this.port}/dashboard`, "WEBSERVER");
      }
    });

    this.server.on('error', (error) => {
      logger.log(`Web server error: ${error.message}`, "WEBSERVER");
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      logger.log("Web server stopped", "WEBSERVER");
    }
  }
}

module.exports = WebServer;