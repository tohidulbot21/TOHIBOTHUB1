
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const logger = require("../utils/log.js");

module.exports = function ({ api }) {
  const Users = require("./database/users")({ api });
  const Threads = require("./database/threads")({ api });
  const Currencies = require("./database/currencies")({ api, Users });
  
  // Enhanced rate limiting and safety
  const messageQueue = new Map();
  const commandCooldowns = new Map();
  const userLastActivity = new Map();
  
  // Load bot settings
  let botSettings = {};
  try {
    botSettings = require("../config/botSettings.json");
  } catch (e) {
    botSettings = {
      SAFETY_MODE: true,
      RATE_LIMITING: { ENABLED: false, MIN_MESSAGE_INTERVAL: 1000 }, // More permissive
      ERROR_HANDLING: { SILENT_FAILURES: true }
    };
  }

  // Initialize database data silently
  (async function initializeData() {
    try {
      const [threads, users] = await Promise.all([
        Threads.getAll().catch(() => []),
        Users.getAll(["userID", "name", "data"]).catch(() => [])
      ]);
      
      // Process threads data
      threads.forEach((data) => {
        const idThread = String(data.threadID);
        global.data.allThreadID.push(idThread);
        global.data.threadData.set(idThread, data.data || {});
        global.data.threadInfo.set(idThread, data.threadInfo || {});
        
        if (data.data?.banned) {
          global.data.threadBanned.set(idThread, {
            reason: data.data.reason || "",
            dateAdded: data.data.dateAdded || ""
          });
        }
        
        if (data.data?.commandBanned?.length) {
          global.data.commandBanned.set(idThread, data.data.commandBanned);
        }
        
        if (data.data?.NSFW) {
          global.data.threadAllowNSFW.push(idThread);
        }
      });
      
      // Process users data
      users.forEach((dataU) => {
        const idUsers = String(dataU.userID);
        global.data.allUserID.push(idUsers);
        
        if (dataU.name?.length) {
          global.data.userName.set(idUsers, dataU.name);
        }
        
        if (dataU.data?.banned) {
          global.data.userBanned.set(idUsers, {
            reason: dataU.data.reason || "",
            dateAdded: dataU.data.dateAdded || ""
          });
        }
        
        if (dataU.data?.commandBanned?.length) {
          global.data.commandBanned.set(idUsers, dataU.data.commandBanned);
        }
      });
      
      if (global.config.autoCreateDB) {
        logger.log(`Database loaded: ${global.data.allThreadID.length} threads, ${global.data.allUserID.length} users`, "DATABASE");
      }
    } catch (error) {
      logger.log(`Database initialization error (ignored): ${error.message}`, "DEBUG");
    }
  })();

  // Enhanced handler objects
  const runObj = {
    api,
    Users,
    Threads,
    Currencies,
    logger,
    botSettings
  };

  // Load all handlers with error protection
  const handlers = {};
  try {
    // Clear require cache to prevent conflicts
    delete require.cache[require.resolve("./handle/handleCommand")];
    delete require.cache[require.resolve("./handle/handleCommandEvent")];
    delete require.cache[require.resolve("./handle/handleReply")];
    delete require.cache[require.resolve("./handle/handleReaction")];
    delete require.cache[require.resolve("./handle/handleEvent")];
    delete require.cache[require.resolve("./handle/handleRefresh")];
    delete require.cache[require.resolve("./handle/handleCreateDatabase")];
    
    handlers.handleCommand = require("./handle/handleCommand")(runObj);
    handlers.handleCommandEvent = require("./handle/handleCommandEvent")(runObj);
    handlers.handleReply = require("./handle/handleReply")(runObj);
    handlers.handleReaction = require("./handle/handleReaction")(runObj);
    handlers.handleEvent = require("./handle/handleEvent")(runObj);
    handlers.handleRefresh = require("./handle/handleRefresh")(runObj);
    handlers.handleCreateDatabase = require("./handle/handleCreateDatabase")(runObj);
  } catch (error) {
    logger.log(`Handler loading error: ${error.message}`, "ERROR");
  }

  // Simple approval check - no longer used in main flow
  function checkApproval(event) {
    return true; // Deprecated, approval now handled inline
  }

  // Much more lenient rate limiting
  function checkRateLimit(userID, commandName = null) {
    if (!botSettings.RATE_LIMITING?.ENABLED) return true;
    
    const now = Date.now();
    const lastActivity = userLastActivity.get(userID) || 0;
    const minInterval = botSettings.RATE_LIMITING.MIN_MESSAGE_INTERVAL || 500; // Very short interval
    
    if (now - lastActivity < minInterval) {
      return false;
    }
    
    userLastActivity.set(userID, now);
    return true;
  }

  // Enhanced error handler - less strict
  function handleError(error, context = "Unknown") {
    if (!error) return;
    
    const errorStr = error.toString().toLowerCase();
    
    // Ignore common/harmless errors
    const ignorableErrors = [
      'rate limit exceeded',
      'enoent',
      'timeout',
      'connection reset',
      'typ', 'typing', 'presence',
      'read_receipt',
      'delivery_receipt',
      'not allowed by admins',
      'couldn\'t send',
      'error: 3370026'
    ];
    
    if (ignorableErrors.some(err => errorStr.includes(err))) {
      return; // Silently ignore
    }
    
    logger.log(`${context} error: ${error.message}`, "DEBUG");
  }

  // Main event handler - much more permissive
  return async (event) => {
    try {
      if (!event || !event.type) return;
      
      // Skip ready events
      if (event.type === 'ready') return;
      
      // Check approval for groups (admins bypass)
      if (event.threadID && event.threadID !== event.senderID) {
        const isAdmin = global.config.ADMINBOT?.includes(event.senderID);
        
        if (!isAdmin) {
          const Groups = require("./database/groups")({ api });
          
          if (!Groups.isApproved(event.threadID)) {
            // Silently block unapproved groups
            return;
          }
        }
      }
      
      // Very lenient rate limiting - mostly disabled
      if (!checkRateLimit(event.senderID)) {
        // Don't block, just log
        logger.log(`Rate limit notice for user ${event.senderID}`, "DEBUG");
      }
      
      const listenObj = { event };
      
      // Handle different event types with enhanced error protection
      switch (event.type) {
        case "message":
        case "message_reply":
        case "message_unsend":
          try {
            // Always try to execute commands
            await Promise.allSettled([
              handlers.handleCreateDatabase?.(listenObj),
              handlers.handleCommand?.(listenObj),
              handlers.handleReply?.(listenObj),
              handlers.handleCommandEvent?.(listenObj)
            ]);
          } catch (handlerError) {
            // Don't block on handler errors
            logger.log(`Message handler issue: ${handlerError.message}`, "DEBUG");
          }
          break;
          
        case "event":
          try {
            await Promise.allSettled([
              handlers.handleEvent?.(listenObj),
              handlers.handleRefresh?.(listenObj)
            ]);
          } catch (eventError) {
            logger.log(`Event handler issue: ${eventError.message}`, "DEBUG");
          }
          break;
          
        case "message_reaction":
          if (handlers.handleReaction) {
            await handlers.handleReaction(listenObj).catch(error => 
              logger.log(`Reaction handler issue: ${error.message}`, "DEBUG")
            );
          }
          break;
          
        case "change_thread_image":
        case "typ":
        case "typing":
        case "presence":
        case "read_receipt":
        case "delivery_receipt":
        case "read":
        case "delivered":
        case "read_receipt":
        case "delivery":
        case "message_seen":
        case "seen":
        case "notification_messages":
        case "buddylist_overlay":
        case "inbox":
        case "pages_messaging":
        case "jewel_requests_add":
        case "mobile_requests_count":
        case "notifications_seen":
        case "notifications_sound":
        case "mark_seen":
          // Handle silently - these are normal Facebook events
          return; // Exit early to prevent any processing
          
        default:
          // Silently ignore unknown event types to reduce spam
          return;
      }
      
    } catch (error) {
      // Don't let main handler errors stop the bot
      logger.log(`Main event handler issue: ${error.message}`, "DEBUG");
    }
  };
};
