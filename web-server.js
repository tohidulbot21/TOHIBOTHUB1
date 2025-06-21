const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/log.js');

class WebServer {
  constructor() {
    this.app = express();
    // Render deployment fix - use 0.0.0.0 instead of localhost
    this.port = process.env.PORT || 10000;
    this.host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static('public'));

    // Add CORS for Render deployment
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
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
    try {
      // Use 0.0.0.0 for Render deployment
      this.server = this.app.listen(this.port, '0.0.0.0', () => {
        logger.log(`Web server running on 0.0.0.0:${this.port}`, "WEBSERVER");
        logger.log(`Dashboard: http://0.0.0.0:${this.port}/dashboard`, "WEBSERVER");

        // Additional Render-specific logging
        if (process.env.RENDER) {
          logger.log(`Render deployment detected - External URL: ${process.env.RENDER_EXTERNAL_URL}`, "WEBSERVER");
        }
      });
    } catch (error) {
      logger.log(`Web server error: ${error.message}`, "WEBSERVER");
    }
  }

  stop() {
    if (this.server) {
      this.server.close();
      logger.log("Web server stopped", "WEBSERVER");
    }
  }
}

module.exports = WebServer;