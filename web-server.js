const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/log.js');

class WebServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
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
    this.server = this.app.listen(this.port, '0.0.0.0', () => {
      logger.log(`Web server running on port ${this.port}`, "WEBSERVER");
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