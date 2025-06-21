module.exports = function ({ api, Users, Threads, Currencies, logger }) {
  return async function handleEvent({ event }) {
    try {
      if (!event || event.type !== "event") return;

      const { events } = global.client;
      if (!events || events.size === 0) return;

      const { threadID, senderID, logMessageType } = event;

      // Process each event handler
      for (const [eventName, eventHandler] of events) {
        try {
          if (!eventHandler.run) continue;

          const { config } = eventHandler;

          // Check if event type matches
          if (config.eventType && !config.eventType.includes(logMessageType)) {
            continue;
          }

          // Create run object
          const runObj = {
            api,
            event,
            Users,
            Threads,
            Currencies,
            logger,
            Groups: global.data.groups
          };

          // Execute event handler with extended timeout
          await Promise.race([
            eventHandler.run(runObj),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Event timeout')), 180000)
            )
          ]);

        } catch (error) {
          // Suppress common timeout and connection errors
          if (error.message && (
            error.message.includes('Event timeout') ||
            error.message.includes('HandleEvent timeout') ||
            error.message.includes('Rate limit') ||
            error.message.includes('timeout') ||
            error.message.includes('ECONNRESET') ||
            error.message.includes('ETIMEDOUT')
          )) {
            // Silently ignore these common errors
            return;
          }
          logger.log(`Event handler error for ${eventName}: ${error.message}`, "DEBUG");
        }
      }

    } catch (error) {
      logger.log(`HandleEvent error: ${error.message}`, "DEBUG");
    }
  };
};