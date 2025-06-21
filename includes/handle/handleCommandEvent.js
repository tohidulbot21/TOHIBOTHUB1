module.exports = function ({ api, Users, Threads, Currencies, logger }) {
  return async function handleCommandEvent({ event }) {
    try {
      if (!event || event.type !== "message") return;

      const { commands } = global.client;
      const { threadID, senderID } = event;

      // Check if any commands have handleEvent
      for (const [commandName, command] of commands) {
        try {
          if (command.handleEvent) {
            const runObj = {
              api,
              event,
              Users,
              Threads, 
              Currencies,
              logger,
              getText: (key, ...args) => {
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

                // Enhanced fallback messages
                const fallbackMessages = {
                  "levelup": "Congratulations {name}, being talkative helped you level up to level {level}!",
                  "on": "on",
                  "off": "off",
                  "successText": "Success notification!",
                  "user": "User",
                  "adminGroup": "Admin Group", 
                  "adminBot": "Admin Bot",
                  "moduleInfo": "Module: %1 | Usage: %3 | Description: %2",
                  "error": "An error occurred",
                  "noPermission": "No permission",
                  "cooldown": "Please wait"
                };

                // Format message with arguments
                if (fallbackMessages[key]) {
                  let message = fallbackMessages[key];
                  for (let i = 0; i < args.length; i++) {
                    message = message.replace(new RegExp(`%${i + 1}`, 'g'), args[i] || '');
                    message = message.replace(new RegExp(`\\{${i + 1}\\}`, 'g'), args[i] || '');
                    message = message.replace(new RegExp(`\\{name\\}`, 'g'), args[0] || 'User');
                    message = message.replace(new RegExp(`\\{level\\}`, 'g'), args[1] || '1');
                  }
                  return message;
                }

                // Return formatted key if no fallback found
                return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
              }
            };

            // Execute with longer timeout for heavy operations
            await Promise.race([
              command.handleEvent(runObj),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('HandleEvent timeout')), 120000)
              )
            ]);
          }
        } catch (error) {
          // Suppress common timeout and rate limit errors
          if (error.message && (
            error.message.includes('HandleEvent timeout') ||
            error.message.includes('Rate limit') ||
            error.message.includes('timeout') ||
            error.message.includes('timed out') ||
            error.toString().includes('ECONNRESET') ||
            error.toString().includes('ETIMEDOUT')
          )) {
            // Silently ignore these common errors
            return;
          }
          logger.log(`HandleEvent error for ${commandName}: ${error.message}`, "DEBUG");
        }
      }

    } catch (error) {
      logger.log(`HandleCommandEvent error: ${error.message}`, "DEBUG");
    }
  };
};