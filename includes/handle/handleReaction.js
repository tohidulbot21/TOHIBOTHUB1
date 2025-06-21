
module.exports = function ({ api, Users, Threads, Currencies, logger }) {
  return async function handleReaction({ event }) {
    try {
      if (!event || event.type !== "message_reaction") return;
      
      const { handleReaction } = global.client;
      if (!handleReaction || !Array.isArray(handleReaction)) return;
      
      const { threadID, messageID, senderID, reaction } = event;
      
      // Find matching reaction handler
      const reactionIndex = handleReaction.findIndex(react => react.messageID === messageID);
      if (reactionIndex === -1) return;
      
      const reactionData = handleReaction[reactionIndex];
      const { name, author } = reactionData;
      
      // Check if sender matches author (optional)
      if (author && author !== senderID && !global.config.ADMINBOT?.includes(senderID)) {
        return; // Only author or admin can use reaction
      }
      
      // Get command
      const { commands } = global.client;
      const command = commands.get(name);
      if (!command || !command.onReaction) return;
      
      // Create run object
      const runObj = {
        api,
        event,
        Users,
        Threads,
        Currencies,
        Reaction: reactionData,
        logger
      };
      
      try {
        // Execute onReaction with timeout
        await Promise.race([
          command.onReaction(runObj),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Reaction timeout')), 30000)
          )
        ]);
        
        // Remove reaction handler after successful execution
        handleReaction.splice(reactionIndex, 1);
        
      } catch (error) {
        logger.log(`Reaction handler error for ${name}: ${error.message}`, "DEBUG");
        
        // Remove failed reaction handler
        handleReaction.splice(reactionIndex, 1);
      }
      
    } catch (error) {
      logger.log(`HandleReaction error: ${error.message}`, "DEBUG");
    }
  };
};
