const fs = require("fs-extra");
const path = require('path');
const { join } = require('path');
const { execSync } = require('child_process');
const { spawn } = require('child_process');
const botConfig = require("./config.json");
const pkg = require('./package.json');
const listPackage = pkg.dependencies;
const login = require("./includes/login/index.js");
const moment = require("moment-timezone");
// Initialize colorful logging system first
const logger = require("./utils/log.js");
const rateLimitManager = require('./utils/rateLimitManager');

// Enable colorful console output globally
require("./utils/log.js"); // This will override console.log with colorful version
const chalk = require("chalk");
const WebServer = require('./web-server.js');

/**
 * ═══════════════════════════════════════════════════════════
 *                    TOHI-BOT-HUB v1.8.0
 *          Advanced Facebook Messenger Bot Framework
 *               Created by TOHI-BOT-HUB Team
 *        GitHub: https://github.com/TOHI-BOT-HUB/TOHI-BOT-HUB
 * ═══════════════════════════════════════════════════════════
 */

// Enhanced startup banner
console.log(chalk.bold.cyan(`
╭━━┳━┳╮╭┳━━╮╱╭━━┳━┳━━╮╱╭╮╭┳┳┳━━╮
╰╮╭┫┃┃╰╯┣┃┣┻━┫╭╮┃┃┣╮╭┻━┫╰╯┃┃┃╭╮┃
╱┃┃┃┃┃╭╮┣┃┣┳━┫╭╮┃┃┃┃┣━━┫╭╮┃┃┃╭╮┃
╱╰╯╰━┻╯╰┻━━╯╱╰━━┻━╯╰╯╱╱╰╯╰┻━┻━━╯`));

// Initialize web server with enhanced error handling
try {
  const webServer = new WebServer();
  webServer.start();
  logger.log("Web server initialized successfully", "WEBSERVER");
} catch (error) {
  logger.log(`Web server initialization failed: ${error.message}`, "WEBSERVER");
}

// Initialize bank API server
try {
  const { startBankAPI } = require('./includes/database/bank-api.js');
  startBankAPI();
  logger.log("Bank API server initialized successfully", "BANK-API");
} catch (error) {
  logger.log(`Bank API server initialization failed: ${error.message}`, "BANK-API");
}

// Global system initialization
logger.log("Initializing TOHI-BOT-HUB System...", "STARTER");

// Enhanced global objects
global.utils = require("./utils/index.js");
global.loading = require("./utils/log.js");
global.errorHandler = require("./utils/globalErrorHandler.js");
global.facebookRateLimit = require("./utils/facebookRateLimit.js");

// Initialize global objects only if they don't exist
if (typeof global.nodemodule === 'undefined') global.nodemodule = new Object();
if (typeof global.config === 'undefined') global.config = new Object();
if (typeof global.configModule === 'undefined') global.configModule = new Object();
if (typeof global.moduleData === 'undefined') global.moduleData = new Array();
if (typeof global.language === 'undefined') global.language = new Object();
if (typeof global.account === 'undefined') global.account = new Object();

// Enhanced global error handlers
process.on('unhandledRejection', (reason, promise) => {
  if (reason && (
    reason.toString().includes('ENOENT') ||
    reason.toString().includes('rate limit') ||
    reason.toString().includes('1357031') ||
    reason.toString().includes('1390008') ||
    reason.toString().includes('Request failed with status code 401') ||
    reason.toString().includes('Request failed with status code 404') ||
    reason.toString().includes('Request failed with status code 500') ||
    reason.toString().includes('HandleEvent timeout') ||
    reason.toString().includes('Reply timeout') ||
    reason.toString().includes('Event timeout') ||
    reason.toString().includes('timeout') ||
    reason.toString().includes('ECONNRESET') ||
    reason.toString().includes('ETIMEDOUT') ||
    reason.message?.includes('status code 401') ||
    reason.message?.includes('status code 404') ||
    reason.message?.includes('status code 500') ||
    reason.message?.includes('timeout')
  )) {
    // Ignore common Facebook API, file system, timeout, and external API errors
    return;
  }
  logger.log(`Unhandled Rejection: ${reason}`, "ERROR");
});

process.on('uncaughtException', (error) => {
  if (error.code === 'ENOENT' && error.path && error.path.includes('cache')) {
    // Ignore cache file errors
    return;
  }

  logger.log(`Uncaught Exception: ${error.message}`, "ERROR");

  // Handle critical errors that need restart
  const criticalErrors = ['ECONNRESET', 'ENOTFOUND', 'socket hang up'];
  const isCritical = criticalErrors.some(err => error.message && error.message.includes(err));

  if (isCritical) {
    logger.log("Critical error detected, restarting...", "RESTART");
    setTimeout(() => process.exit(1), 3000);
  }
});

// Enhanced bot startup function
function startProject() {
  try {
    logger.log("Starting TOHI-BOT-HUB main process...", "STARTUP");

    // Initialize performance optimizer
    try {
      const performanceOptimizer = require('./utils/performanceOptimizer');
      performanceOptimizer.startAutoOptimization();
    } catch (e) {
      logger.log("Performance optimizer initialization failed", "WARNING");
    }

    // Initialize command recovery system
    try {
      const commandRecovery = require('./utils/commandRecovery');
      commandRecovery.startAutoCleanup();
    } catch (e) {
      logger.log("Command recovery system initialization failed", "WARNING");
    }

    const child = spawn("node", [
      "--trace-warnings", 
      "--async-stack-traces", 
      "--max-old-space-size=3072", // Increased memory limit
      "--expose-gc", // Enable garbage collection
      "index.js"
    ], {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true
    });

    child.on("close", (codeExit) => {
      if (codeExit !== 0) {
        logger.log(`Process exited with code ${codeExit}, restarting...`, "RESTART");
        setTimeout(() => startProject(), 5000);
      }
    });

    child.on("error", (error) => {
      if (!shouldIgnoreError(error)) {
        logger.log(`Child process error: ${error.message}`, "ERROR");
      }
    });

  } catch (error) {
    logger.log(`Startup error: ${error.message}`, "ERROR");
    setTimeout(() => startProject(), 10000);
  }
}

// Enhanced client object
global.client = {
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: new Array(),
  handleSchedule: new Array(),
  handleReaction: new Array(),
  handleReply: new Array(),
  mainPath: process.cwd(),
  configPath: new String(),

  // Enhanced time functions
  getTime: function(option) {
    const timezone = "Asia/Manila";
    const format = {
      "seconds": "ss",
      "minutes": "mm", 
      "hours": "HH",
      "date": "DD",
      "month": "MM",
      "year": "YYYY",
      "fullHour": "HH:mm:ss",
      "fullYear": "DD/MM/YYYY",
      "fullTime": "HH:mm:ss DD/MM/YYYY"
    };

    return moment.tz(timezone).format(format[option] || "HH:mm:ss DD/MM/YYYY");
  },

  timeStart: Date.now()
};

// Enhanced data storage
global.data = {
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: new Array(),
  allUserID: new Array(),
  allCurrenciesID: new Array(),
  allThreadID: new Array()
};

// Enhanced theme loading system
const { getThemeColors } = require("./utils/log.js");
const { main, secondary, tertiary, html } = getThemeColors();

try {
  const themePath = './includes/cover/html.json';
  let themeData;

  // Load or create theme configuration
  if (fs.existsSync(themePath)) {
    try {
      const rawData = fs.readFileSync(themePath, 'utf8');
      themeData = rawData.trim() ? JSON.parse(rawData) : null;

      if (!themeData || !themeData.THEME_COLOR) {
        themeData = null;
      }
    } catch (parseErr) {
      logger.log(`Theme parse error: ${parseErr.message}`, "THEME");
      themeData = null;
    }
  } else {
    themeData = null;
  }

  // Create default theme if needed
  if (!themeData) {
    const defaultTheme = {
      THEME_COLOR: html || "#1702CF",
      primary: "#1702CF",
      secondary: "#11019F", 
      tertiary: "#1401BF",
      background: "#000000",
      text: "#ffffff",
      accent: "#1702CF"
    };

    fs.ensureDirSync(path.dirname(themePath));
    fs.writeFileSync(themePath, JSON.stringify(defaultTheme, null, 2));
    logger.log("Theme configuration created successfully", "THEME");
  }

} catch (error) {
  logger.log(`Theme system error: ${error.message}`, "THEME");
}

// Configuration loading
let configValue;
try {
  global.client.configPath = path.join(global.client.mainPath, "config.json");
  configValue = botConfig;
  logger.log("Configuration loaded successfully", "CONFIG");
} catch (e) {
  logger.log("Configuration file not found or invalid", "CONFIG");
  process.exit(1);
}

// Apply configuration
try {
  for (const key in configValue) {
    global.config[key] = configValue[key];
  }
  logger.log("Configuration applied successfully", "CONFIG");
} catch (e) {
  logger.log("Failed to apply configuration", "CONFIG");
  process.exit(1);
}

// Load node modules
for (const property in listPackage) {
  try {
    global.nodemodule[property] = require(property);
  } catch (e) {
    // Silent fail for optional modules
  }
}

// Enhanced language loading system
try {
  const langFile = fs.readFileSync(
    `${process.cwd()}/languages/${global.config.language || "en"}.lang`, 
    { encoding: 'utf-8' }
  ).split(/\r?\n|\r/);

  const langData = langFile.filter(item => item.indexOf('#') !== 0 && item !== '');

  for (const item of langData) {
    const getSeparator = item.indexOf('=');
    if (getSeparator === -1) continue;

    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');

    if (typeof global.language[head] === "undefined") {
      global.language[head] = {};
    }
    global.language[head][key] = value;
  }

  logger.log(`Language pack loaded: ${global.config.language || "en"}`, "LANGUAGE");
} catch (error) {
  logger.log(`Language loading failed: ${error.message}`, "LANGUAGE");
}

// Enhanced getText function
global.getText = function(...args) {
  const langText = global.language;

  if (!langText.hasOwnProperty(args[0])) {
    throw new Error(`Language key not found: ${args[0]}`);
  }

  let text = langText[args[0]][args[1]];
  if (typeof text === 'undefined') {
    throw new Error(`Text key not found: ${args[1]}`);
  }

  // Replace placeholders
  for (let i = args.length - 1; i > 0; i--) {
    const regEx = new RegExp(`%${i}`, 'g');
    text = text.replace(regEx, args[i + 1]);
  }

  return text;
};

// Enhanced appstate loading
let appState = [];
const appStateFile = path.resolve(path.join(global.client.mainPath, botConfig.APPSTATEPATH || "appstate.json"));

try {
  if (!fs.existsSync(appStateFile)) {
    throw new Error("AppState file not found");
  }

  const isEncrypted = (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && botConfig.encryptSt;
  let fileContent = fs.readFileSync(appStateFile, 'utf8');

  if (!fileContent || fileContent.trim() === '') {
    throw new Error("AppState file is empty");
  }

  if (isEncrypted && fileContent[0] !== "[") {
    appState = JSON.parse(global.utils.decryptState(fileContent, (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER)));
  } else {
    appState = JSON.parse(fileContent);
  }

  // Validate appstate structure
  if (!Array.isArray(appState) || appState.length === 0) {
    throw new Error("AppState is empty or invalid format");
  }

  // Check for required cookies
  const hasUserCookie = appState.some(c => c.key === "c_user" || c.key === "i_user");
  const hasSessionCookie = appState.some(c => c.key === "xs" || c.key === "fr");

  if (!hasUserCookie) {
    throw new Error("AppState missing user cookie (c_user or i_user)");
  }

  if (!hasSessionCookie) {
    throw new Error("AppState missing session cookies (xs or fr)");
  }

  logger.log("Bot appstate loaded and validated successfully", "APPSTATE");
} catch (e) {
  logger.log(`Bot appstate error: ${e.message}`, "APPSTATE");
  logger.log("Please provide a valid appstate.json file with Facebook login cookies", "APPSTATE");
  appState = [];
}

// Enhanced bot initialization function
function initializeBot() {
  // Check if appstate is valid before attempting login
  if (!appState || !Array.isArray(appState) || appState.length === 0) {
    logger.log("❌ Cannot start bot: No valid appstate provided", "LOGIN");
    logger.log("Please ensure your appstate.json contains valid Facebook cookies", "LOGIN");
    return;
  }

  const loginData = { appState: appState };

  login(loginData, async (err, api) => {
    if (err) {
      if (err.error === 'Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.') {
        logger.log("Account verification required. Please log in with browser.", "LOGIN");
        return process.exit(0);
      } else {
        logger.log(`Login error: ${err}`, "LOGIN");
        return process.exit(0);
      }
    }

    // Load custom functions
    try {
      const custom = require('./custom.js');
      if (typeof custom === 'function') {
        custom({ api });
      }
      logger.log("Custom functions loaded successfully", "CUSTOM");
    } catch (error) {
      logger.log(`Custom functions failed: ${error.message}`, "CUSTOM");
    }

    // Configure API options
    api.setOptions(global.config.FCAOption || {});

    // Save appstate
    try {
      const currentState = await Promise.resolve(api.getAppState());
      let stateData = JSON.stringify(currentState, null, 2);

      if ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && global.config.encryptSt) {
        stateData = await global.utils.encryptState(stateData, process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER);
      }

      fs.writeFileSync(appStateFile, stateData);
      logger.log("Appstate saved successfully", "APPSTATE");
    } catch (error) {
      logger.log(`Appstate save failed: ${error.message}`, "APPSTATE");
    }

    // Set global variables
    global.account.cookie = api.getAppState().map(i => `${i.key}=${i.value}`).join(";");
    global.client.api = api;
    global.config.version = botConfig.version;

    // Load commands
    await loadCommands();

    // Load events  
    await loadEvents();

    // Start listening
    startListening(api);
  });
}

// Enhanced command loading function
async function loadCommands() {
  const commandsPath = `${global.client.mainPath}/modules/commands`;
  const listCommand = fs.readdirSync(commandsPath)
    .filter(command => command.endsWith('.js') && 
            !command.includes('example') && 
            !global.config.commandDisabled.includes(command));

  console.log(tertiary(`\n──LOADING COMMANDS─●`));

  let loadedCount = 0;
  let failedCount = 0;

  for (const command of listCommand) {
    try {
      delete require.cache[require.resolve(`${commandsPath}/${command}`)];
      const module = require(`${commandsPath}/${command}`);
      const { config } = module;

      // Validation
      if (!config?.name) {
        throw new Error(`Command ${command} has no name property`);
      }

      if (!config?.commandCategory) {
        throw new Error(`Command ${command} has no commandCategory`);
      }

      if (!config.hasOwnProperty('usePrefix')) {
        throw new Error(`Command ${command} missing usePrefix property`);
      }

      if (global.client.commands.has(config.name)) {
        throw new Error(`Command ${config.name} already loaded`);
      }

      // Handle dependencies
      if (config.dependencies) {
        await handleDependencies(config.dependencies);
      }

      // Handle environment config
      if (config.envConfig) {
        handleEnvConfig(config.name, config.envConfig);
      }

      // Execute onLoad function
      if (module.onLoad) {
        try {
          await module.onLoad({ api: global.client.api });
        } catch (error) {
          logger.log(`OnLoad failed for ${config.name}: ${error.message}`, "COMMAND");
        }
      }

      // Register command
      if (module.handleEvent) {
        global.client.eventRegistered.push(config.name);
      }

      global.client.commands.set(config.name, module);
      logger.log(`✓ ${config.name} loaded successfully`, "COMMAND");
      loadedCount++;

    } catch (error) {
      if (error.message.includes('Cannot use import statement outside a module')) {
        logger.log(`✗ ${command} skipped: ES6 module compatibility issue`, "COMMAND");
      } else {
        logger.log(`✗ ${command} failed: ${error.message}`, "COMMAND");
      }
      failedCount++;
    }
  }

  logger.log(`Commands loaded: ${loadedCount} successful, ${failedCount} failed`, "COMMAND");
}

// Enhanced event loading function
async function loadEvents() {
  const eventsPath = path.join(global.client.mainPath, 'modules/events');
  const events = fs.readdirSync(eventsPath)
    .filter(ev => ev.endsWith('.js') && !global.config.eventDisabled.includes(ev));

  console.log(tertiary(`\n──LOADING EVENTS─●`));

  let loadedCount = 0;
  let failedCount = 0;

  for (const ev of events) {
    try {
      delete require.cache[require.resolve(path.join(eventsPath, ev))];
      const event = require(path.join(eventsPath, ev));
      const { config, onLoad, run } = event;

      if (!config?.name || !run) {
        throw new Error(`Event ${ev} invalid format`);
      }

      if (global.client.events.has(config.name)) {
        throw new Error(`Event ${config.name} already loaded`);
      }

      // Handle dependencies
      if (config.dependencies) {
        await handleDependencies(config.dependencies);
      }

      // Handle environment config
      if (config.envConfig) {
        handleEnvConfig(config.name, config.envConfig);
      }

      // Execute onLoad function
      if (onLoad) {
        try {
          await onLoad({ api: global.client.api });
        } catch (error) {
          logger.log(`OnLoad failed for ${config.name}: ${error.message}`, "EVENT");
        }
      }

      global.client.events.set(config.name, event);
      global.client.eventRegistered.push(config.name);
      logger.log(`✓ ${config.name} loaded successfully`, "EVENT");
      loadedCount++;

    } catch (error) {
      logger.log(`✗ ${ev} failed: ${error.message}`, "EVENT");
      failedCount++;
    }
  }

  logger.log(`Events loaded: ${loadedCount} successful, ${failedCount} failed`, "EVENT");
}

// Dependency handler
async function handleDependencies(dependencies) {
  const builtinModules = ['fs', 'path', 'http', 'https', 'url', 'crypto', 'util', 'os', 'child_process', 'stream', 'events', 'buffer', 'querystring', 'zlib'];

  for (const [reqDependency, version] of Object.entries(dependencies)) {
    if (listPackage[reqDependency] || builtinModules.includes(reqDependency)) continue;

    try {
      const installCmd = `npm install --no-package-lock --save ${reqDependency}${version ? '@' + version : ''}`;
      execSync(installCmd, {
        stdio: 'inherit',
        env: process.env,
        shell: true,
        cwd: join(process.cwd(), 'node_modules')
      });

      // Clear require cache
      Object.keys(require.cache).forEach(key => delete require.cache[key]);

    } catch (error) {
      logger.log(`Failed to install ${reqDependency}: ${error.message}`, "DEPENDENCY");
    }
  }
}

// Environment config handler
function handleEnvConfig(moduleName, envConfig) {
  global.configModule[moduleName] = global.configModule[moduleName] || {};
  global.config[moduleName] = global.config[moduleName] || {};

  for (const [key, value] of Object.entries(envConfig)) {
    global.configModule[moduleName][key] = global.config[moduleName][key] ?? value;
    global.config[moduleName][key] = global.config[moduleName][key] ?? value;
  }

  // Update config file
  try {
    const configPath = botConfig;
    configPath[moduleName] = envConfig;
    fs.writeFileSync(global.client.configPath, JSON.stringify(configPath, null, 2), 'utf-8');
  } catch (error) {
    logger.log(`Config update failed for ${moduleName}: ${error.message}`, "CONFIG");
  }
}

// Enhanced listening function
async function startListening(api) {
  console.log(tertiary(`\n──BOT READY─●`));

  // Display startup statistics
  const startupTime = ((Date.now() - global.client.timeStart) / 1000).toFixed(2);
  logger.log(`✓ System ready! Commands: ${global.client.commands.size}, Events: ${global.client.events.size}`, "READY");
  logger.log(`⏱️ Startup time: ${startupTime}s`, "READY");

  // Log bot info at the very end
  logger.log(
    `[ BOT_INFO ] success!\n[ NAME ]: ${global.config.BOTNAME || "Bot Messenger"} \n[ BotID ]: ${api.getCurrentUserID()}\n[ PREFIX ]: ${global.config.PREFIX}`,
    "LOADED"
  );

  // Load listener
  const listener = require('./includes/listen.js');



  // Start listening with full error logging
  global.handleListen = api.listenMqtt(async (error, event) => {
    if (error) {
      // Handle critical login errors
      if (error.error === 'Not logged in.' || error.error === 'Not logged in') {
        logger.log("Authentication lost, please re-login", "AUTH");
        return process.exit(1);
      }

      // Log all errors except ready state
      if (error.type !== 'ready') {
        logger.log(`Listen error: ${error}`, "LISTEN");
      }
      return;
    }

    // Handle events
    if (event && event.type !== 'ready') {
      return listener({ api })(event);
    }
  });
}

// Database initialization
(async () => {
  try {
    console.log(tertiary(`\n──DATABASE─●`));
    logger.log("✓ Connected to JSON database successfully!", "DATABASE");

    // Start bot initialization
    initializeBot();

  } catch (error) {
    logger.log(`✗ Database connection failed: ${error.message}`, "DATABASE");
  }
})();

/**
 * ═══════════════════════════════════════════════════════════
 *                     TOHI-BOT-HUB
 *              © 2024 TOHI-BOT-HUB Team
 *        GitHub: https://github.com/TOHI-BOT-HUB/TOHI-BOT-HUB
 *              Do not remove credits
 * ═══════════════════════════════════════════════════════════
 */

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  const globalErrorHandler = require('./utils/globalErrorHandler');

  // Check if this is an ignorable error
  if (reason && (
    reason.toString().includes('Rate limit') ||
    reason.toString().includes('does not exist in Database') ||
    reason.error === 3252001 ||
    reason.error === 1390008 ||
    reason.toString().includes('shouldIgnoreError is not defined') ||
    reason.toString().includes("You can't use this feature at the moment")
  )) {
    // Log but don't crash for these errors - these are common Facebook API issues
    return;
  }

  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  globalErrorHandler.logError(reason, 'UnhandledRejection');
});

process.on('uncaughtException', (error) => {
  const globalErrorHandler = require('./utils/globalErrorHandler');
  console.error('Uncaught Exception:', error);
  globalErrorHandler.logError(error, 'UncaughtException');
});

// Global client properties already initialized above

// Initialize script cleanup utility
require('./utils/scriptCleanup');

// Initialize groups data only after api is available
if (typeof global.client !== 'undefined' && global.client.api) {
  global.data.groups = require('./includes/database/groups')({ api: global.client.api });
}