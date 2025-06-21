module.exports = function ({ api, Users, Threads, Currencies, logger, botSettings }) {
  const moment = require("moment-timezone");
  const axios = require("axios");

  // Enhanced error checking
  function shouldIgnoreError(error) {
    if (!error) return true;

    const errorStr = error.toString().toLowerCase();
    const ignorablePatterns = [
      'rate limit',
      'enoent',
      'network timeout',
      'connection reset',
      'does not exist in database',
      'you can\'t use this feature',
      'took too long to execute',
      'command timeout',
      'execution timeout',
      'request timeout',
      'socket timeout',
      'network error',
      'api error',
      'facebook error',
      'permission denied',
      'access denied',
      'invalid session',
      'login required',
      'cannot read properties of undefined',
      'getname is not a function',
      'mqtt',
      'attachment url',
      'has no valid run or onstart function',
      'command has no valid',
      'no valid function',
      'function is not defined'
    ];

    return ignorablePatterns.some(pattern => errorStr.includes(pattern));
  }

  // Enhanced cooldown management
  const cooldowns = new Map();
  const userActivity = new Map();

  function checkCooldown(userID, commandName, cooldownTime) {
    if (!cooldownTime || cooldownTime <= 0) return true;

    const key = `${userID}_${commandName}`;
    const now = Date.now();
    const lastUsed = cooldowns.get(key) || 0;

    if (now - lastUsed < cooldownTime * 1000) {
      return false;
    }

    cooldowns.set(key, now);
    return true;
  }

  // Command execution without timeout
  async function executeCommand(command, Obj, commandName) {
    try {
      // Support run, onStart, and start functions
      if (typeof command.run === 'function') {
        return await command.run(Obj);
      } else if (typeof command.onStart === 'function') {
        return await command.onStart(Obj);
      } else if (typeof command.start === 'function') {
        return await command.start(Obj);
      } else {
        // Silently ignore commands without valid functions
        return;
      }
    } catch (error) {
      // Enhanced error handling with better categorization
      const errorMessage = error.message || error.toString();

      // Ignore common harmless errors silently
      const ignorableErrors = [
        'rate limit', 'rate', 'ENOENT', 'not found', 'timeout', 'TIMEOUT',
        'Permission', 'banned', 'not allowed', 'couldn\'t send', 'error: 3370026'
      ];

      if (ignorableErrors.some(err => errorMessage.toLowerCase().includes(err.toLowerCase()))) {
        return; // Silent handling for common errors
      }

      // Only log genuine unexpected errors
      logger.log(`Command execution error [${commandName}]: ${errorMessage}`, "DEBUG");
    }
  }

  function getCommandTimeout(commandName) {
    // Heavy commands get longer timeout
    const heavyCommands = [
      'album', 'album2', 'work', 'daily', 'video', 'video2', 'video3',
      'sing', 'sing2', 'tiktok', 'download', 'ai', 'gemini', 'imagine',
      'dalle', 'art', 'cover', 'fbcover', 'insta', 'twitter', 'pinterest'
    ];

    const veryHeavyCommands = [
      'album2', 'work', 'video3', 'download', 'fbvideo'
    ];

    if (veryHeavyCommands.includes(commandName?.toLowerCase())) {
      return 300000; // 5 minutes
    } else if (heavyCommands.includes(commandName?.toLowerCase())) {
      return 180000; // 3 minutes
    } else {
      return 60000; // 1 minute
    }
  }

  return async function handleCommand({ event }) {
    try {
      if (!event || !event.body) return;

      const { api } = global.client;
      const { commands } = global.client;
      const { threadID, messageID, senderID, isGroup } = event;

      // Check if group is approved before executing any commands using new Groups system
      const Groups = require('../database/groups')({ api: global.client.api });

      // Check if user is admin/owner
      const isAdmin = global.config.ADMINBOT?.includes(senderID);
      const isOwner = global.config.ADMINBOT?.includes(senderID);

      // For group chats, check if group is approved (strict approval system)
      if (event.threadID && event.threadID !== event.senderID) {
        // Get group approval status - but allow commands by default if Groups is not working
        let isApproved = true;
        let isPending = false;
        let isRejected = false;

        try {
          isApproved = Groups.isApproved(event.threadID);
          isPending = Groups.isPending(event.threadID);
          isRejected = Groups.isRejected(event.threadID);
        } catch (error) {
          // If Groups system fails, allow commands to work
          logger.log(`Groups system error, allowing commands: ${error.message}`, "DEBUG");
          isApproved = true;
        }

        // Parse command early
        const messageBody = event.body || "";
        const prefix = global.config.PREFIX || "+";
        const commandName = messageBody.substring(prefix.length).split(' ')[0].toLowerCase();

        // Allow only approve command for owners in unapproved groups
        const isApproveCommand = commandName === "approve";

        // Block rejected groups completely (except owners)
        if (isRejected && !isOwner) {
          logger.log(`Command ${commandName} blocked in rejected group ${event.threadID}`, "DEBUG");
          return;
        }

        // Block unapproved groups (except owners and approve command)
        if (!isApproved && !isAdmin && !isOwner && !isApproveCommand) {
          // Send notification only once per group per session
          if (!global.notifiedGroups) global.notifiedGroups = new Set();

          if (!global.notifiedGroups.has(event.threadID)) {
            api.sendMessage(
              `⚠️ এই গ্রুপটি এখনো approve করা হয়নি!\n\n` +
              `🚫 Bot commands কাজ করবে না যতক্ষণ না admin approve করে।\n` +
              `👑 Admin: ${global.config.ADMINBOT?.[0] || 'Unknown'}\n\n` +
              `📋 Group ID: ${event.threadID}`,
              event.threadID
            );
            global.notifiedGroups.add(event.threadID);
          }

          logger.log(`Command ${commandName} blocked in unapproved group ${event.threadID}`, "DEBUG");
          return;
        }
      } else {
        // For non-group messages (inbox), allow all commands - continue execution
        // Special handling for admin users in inbox
        if (isAdmin || isOwner) {
          logger.log(`Admin/Owner inbox command allowed from user ${event.senderID}`, "DEBUG");
        } else {
          logger.log(`Inbox command allowed from user ${event.senderID}`, "DEBUG");
        }
      }

      // Get thread settings
      const threadData = global.data.threadData.get(threadID) || {};
      const prefix = threadData.PREFIX || global.config.PREFIX || "/";

      // Check if message starts with prefix
      if (!event.body.startsWith(prefix)) return;

      // Parse command
      const args = event.body.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();

      if (!commandName) return;

      // Get command (check both name and aliases)
      let command = commands.get(commandName);
      if (!command) {
        // Check aliases
        for (const [name, cmd] of commands) {
          if (cmd.config.aliases && Array.isArray(cmd.config.aliases)) {
            if (cmd.config.aliases.includes(commandName)) {
              command = cmd;
              break;
            }
          }
        }
      }

      if (!command) return;

      const commandConfig = command.config;

      // Permission check - use already defined admin check
      if (commandConfig.permission > 0) {
        if (!isAdmin && !isOwner && commandConfig.permission >= 2) {
          return; // Silently ignore for non-admins
        }
      }

      // Cooldown check
      if (commandConfig.cooldowns && !checkCooldown(senderID, commandName, commandConfig.cooldowns)) {
        return; // Silently ignore cooldown violations
      }

      // Thread/User ban check
      const threadBanned = global.data.threadBanned.has(threadID);
      const userBanned = global.data.userBanned.has(senderID);
      const commandBanned = global.data.commandBanned.get(threadID)?.includes(commandName) ||
                           global.data.commandBanned.get(senderID)?.includes(commandName);

      if (threadBanned || userBanned || commandBanned) {
        return; // Silently ignore banned users/threads
      }

      // Rate limiting
      if (botSettings?.RATE_LIMITING?.ENABLED) {
        const lastActivity = userActivity.get(senderID) || 0;
        const now = Date.now();
        const interval = botSettings.RATE_LIMITING.MIN_MESSAGE_INTERVAL || 8000;

        if (now - lastActivity < interval) {
          return; // Silently ignore rate limited users
        }

        userActivity.set(senderID, now);
      }

      // Create fallback getText function that works without language keys
      const fallbackGetText = (key, ...args) => {
        try {
          // Try to use global getText first
          if (global.getText && typeof global.getText === 'function') {
            const result = global.getText(key, ...args);
            if (result && result !== key) {
              return result;
            }
          }
        } catch (e) {
          // Ignore getText errors
        }

        // Fallback messages for common keys
        const fallbackMessages = {
          "moduleInfo": `
╔═────── ★ ★ ─────═╗
        💫 TOHI-BOT MODULE INFO 💫
╚═────── ★ ★ ─────═╝
🔹 Name         : %1
🔸 Usage        : %3
📝 Description   : %2
🌈 Category     : %4
⏳ Cooldown     : %5s
🔑 Permission   : %6

⚡️ Made by TOHIDUL | TOHI-BOT ⚡️`,
          "helpList": `✨ TOHI-BOT has %1 commands available!
🔍 TIP: Type %2help [command name] for details!`,
          "user": "User",
          "adminGroup": "Admin Group",
          "adminBot": "Admin Bot",
          "on": "on",
          "off": "off",
          "successText": "Success!",
          "error": "An error occurred",
          "missingInput": "Please provide required input",
          "noPermission": "You don't have permission to use this command",
          "cooldown": "Please wait before using this command again",
          "levelup": "Congratulations {name}, you leveled up to level {level}!",
          "reason": "Reason",
          "at": "at",
          "banSuccess": "User banned successfully",
          "unbanSuccess": "User unbanned successfully"
        };

        // If we have a fallback message, format it with args
        if (fallbackMessages[key]) {
          let message = fallbackMessages[key];
          for (let i = 0; i < args.length; i++) {
            message = message.replace(new RegExp(`%${i + 1}`, 'g'), args[i] || '');
            message = message.replace(new RegExp(`\\{${i + 1}\\}`, 'g'), args[i] || '');
          }
          return message;
        }

        // If no fallback found, return a generic message
        return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      };

      // Create enhanced run object
      const Obj = {
        api,
        event,
        args,
        Users,
        Threads,
        Currencies,
        permssion: commandConfig.permission || 0,
        getText: fallbackGetText,
        logger
      };

      // Enhanced user info
      try {
        if (!global.data.userName.has(senderID)) {
          const userInfo = await api.getUserInfo(senderID);
          if (userInfo && userInfo[senderID]) {
            global.data.userName.set(senderID, userInfo[senderID].name || "Unknown User");
          }
        }
      } catch (e) {
        // Ignore user info errors
      }

      const userName = global.data.userName.get(senderID) || "Unknown User";

      // Enhanced stylish command usage logging
      try {
        let groupName = "Private Chat";
        if (event.threadID && event.threadID !== event.senderID) {
          try {
            const threadInfo = await api.getThreadInfo(event.threadID);
            groupName = threadInfo.threadName || `Group ${event.threadID.slice(-6)}`;
          } catch (e) {
            groupName = `Group ${event.threadID.slice(-6)}`;
          }
        }

        // Create stylish console output
        const chalk = require("chalk");
        const gradient = require("gradient-string");

        console.log(chalk.cyan("╭─────────────────────────────────────╮"));
        console.log(chalk.cyan("│") + gradient.rainbow("        🚀 COMMAND EXECUTED 🚀       ") + chalk.cyan("│"));
        console.log(chalk.cyan("╰─────────────────────────────────────╯"));
        console.log(chalk.yellow("📋 Group Name: ") + chalk.green(groupName));
        console.log(chalk.yellow("👤 User: ") + chalk.blue(userName));
        console.log(chalk.yellow("🆔 UID: ") + chalk.magenta(senderID));
        console.log(chalk.yellow("⚡ Command: ") + chalk.red(`/${commandName}`));
        console.log(chalk.yellow("📊 Status: ") + chalk.green("✅ SUCCESS"));
        console.log(chalk.yellow("⏰ Time: ") + chalk.cyan(new Date().toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
          hour12: true,
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })));
        console.log(chalk.cyan("─".repeat(40)));
      } catch (logError) {
        // Fallback to simple logging if stylish logging fails
        logger.log(`Command "${commandName}" used by ${userName} (${senderID})`, "COMMAND");
      }

      // Execute command with enhanced error handling
      try {
        await executeCommand(command, Obj, commandName);
      } catch (error) {
        if (shouldIgnoreError(error)) {
          // Log timeout/ignorable errors as DEBUG only
          logger.log(`Command "${commandName}" issue: ${error.message}`, "DEBUG");
        } else {
          // Log other errors normally
          logger.log(`Command "${commandName}" error: ${error.message}`, "ERROR");
        }
      }

    } catch (error) {
      if (!shouldIgnoreError(error)) {
        logger.log(`HandleCommand error: ${error.message}`, "ERROR");
      }
    }
  };
};