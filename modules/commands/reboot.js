
module.exports.config = {
  name: "reboot",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "TOHI-BOT-HUB",
  description: "Reboot all bot modules and restart system",
  commandCategory: "admin",
  usages: "reboot",
  cooldowns: 10,
  usePrefix: true,
  dependencies: {
    "fs-extra": "",
    "child_process": ""
  }
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies }) {
  const { threadID, messageID, senderID } = event;
  const { writeFileSync, readFileSync } = global.nodemodule["fs-extra"];
  const { execSync } = require("child_process");
  
  // Check if user is admin
  if (!global.config.ADMINBOT.includes(senderID)) {
    return api.sendMessage("❌ আপনার এই command ব্যবহার করার permission নেই। শুধুমাত্র admin এই command ব্যবহার করতে পারে।", threadID, messageID);
  }

  try {
    // Send initial message
    const rebootMsg = await api.sendMessage("🔄 Bot reboot শুরু হচ্ছে...\n⚡ সব modules reload করা হচ্ছে...", threadID);

    // Clear all command cache
    const commandsPath = `${global.client.mainPath}/modules/commands`;
    const eventsPath = `${global.client.mainPath}/modules/events`;
    
    // Get all loaded commands and events
    const loadedCommands = Array.from(global.client.commands.keys());
    const loadedEvents = Array.from(global.client.events.keys());

    // Clear require cache for all modules
    Object.keys(require.cache).forEach(key => {
      if (key.includes('/modules/commands/') || key.includes('/modules/events/')) {
        delete require.cache[key];
      }
    });

    // Clear global client data
    global.client.commands.clear();
    global.client.events.clear();
    global.client.eventRegistered = [];
    global.client.handleSchedule = [];
    global.client.handleReaction = [];
    global.client.handleReply = [];

    // Update message
    api.editMessage("🔄 Bot reboot চলছে...\n✅ Cache cleared\n⚡ Modules reload করা হচ্ছে...", rebootMsg.messageID, threadID);

    // Reload all commands
    const fs = require("fs-extra");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    let commandsLoaded = 0;
    let commandsFailed = 0;

    for (const file of commandFiles) {
      try {
        delete require.cache[require.resolve(`${commandsPath}/${file}`)];
        const command = require(`${commandsPath}/${file}`);
        
        if (command.config && command.config.name && command.run) {
          global.client.commands.set(command.config.name, command);
          
          if (command.handleEvent) {
            global.client.eventRegistered.push(command.config.name);
          }
          
          commandsLoaded++;
        }
      } catch (error) {
        commandsFailed++;
        console.error(`Failed to reload command ${file}:`, error.message);
      }
    }

    // Reload all events
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    let eventsLoaded = 0;
    let eventsFailed = 0;

    for (const file of eventFiles) {
      try {
        delete require.cache[require.resolve(`${eventsPath}/${file}`)];
        const event = require(`${eventsPath}/${file}`);
        
        if (event.config && event.config.name && event.run) {
          global.client.events.set(event.config.name, event);
          global.client.eventRegistered.push(event.config.name);
          eventsLoaded++;
        }
      } catch (error) {
        eventsFailed++;
        console.error(`Failed to reload event ${file}:`, error.message);
      }
    }

    // Clear memory cache
    if (global.gc && typeof global.gc === 'function') {
      global.gc();
    }

    // Final success message
    const successMsg = `✅ Bot Reboot সম্পূর্ণ হয়েছে!\n\n` +
                      `📊 **Statistics:**\n` +
                      `🔧 Commands: ${commandsLoaded} loaded, ${commandsFailed} failed\n` +
                      `⚡ Events: ${eventsLoaded} loaded, ${eventsFailed} failed\n` +
                      `🧹 Cache cleared successfully\n` +
                      `💾 Memory optimized\n\n` +
                      `🎯 Bot এখন সম্পূর্ণ ready!`;

    api.editMessage(successMsg, rebootMsg.messageID, threadID);

    console.log(`[REBOOT] Bot rebooted by ${senderID}. Commands: ${commandsLoaded}, Events: ${eventsLoaded}`);

  } catch (error) {
    console.error("Reboot error:", error);
    api.sendMessage(`❌ Reboot করতে error হয়েছে:\n${error.message}`, threadID, messageID);
  }
};

module.exports.languages = {
  "en": {
    "rebootSuccess": "✅ Bot rebooted successfully!",
    "rebootFailed": "❌ Failed to reboot bot",
    "noPermission": "❌ You don't have permission to use this command"
  },
  "bd": {
    "rebootSuccess": "✅ Bot সফলভাবে reboot হয়েছে!",
    "rebootFailed": "❌ Bot reboot করতে ব্যর্থ",
    "noPermission": "❌ আপনার এই command ব্যবহার করার permission নেই"
  }
};
