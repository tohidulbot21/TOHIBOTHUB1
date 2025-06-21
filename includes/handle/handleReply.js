
module.exports = function ({ api, Users, Threads, Currencies, logger }) {
  return async function handleReply({ event }) {
    try {
      if (!event || !event.messageReply) return;
      
      const { handleReply } = global.client;
      if (!handleReply || !Array.isArray(handleReply)) return;
      
      const { threadID, messageID, senderID } = event;
      const messageReplyID = event.messageReply.messageID;
      
      // Find matching reply handler
      const replyIndex = handleReply.findIndex(reply => reply.messageID === messageReplyID);
      if (replyIndex === -1) return;
      
      const reply = handleReply[replyIndex];
      const { name, author } = reply;
      
      // Check if sender matches author (optional) and validate thread
      if (author && author !== senderID && !global.config.ADMINBOT?.includes(senderID)) {
        return; // Only author or admin can use reply
      }
      
      // Validate thread ID matches
      if (reply.threadID && reply.threadID !== threadID) {
        return; // Reply is for different thread
      }
      
      // Get command
      const { commands } = global.client;
      const command = commands.get(name);
      if (!command) return;
      
      // Create run object for both onReply and handleReply methods
      const runObj = {
        api,
        event,
        Users,
        Threads,
        Currencies,
        Reply: reply,
        handleReply: reply,  // For backward compatibility
        logger
      };
      
      try {
        let executed = false;
        
        // Try onReply method first (newer format)
        if (command.onReply && typeof command.onReply === 'function') {
          await Promise.race([
            command.onReply(runObj),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Reply timeout')), 300000)
            )
          ]);
          executed = true;
        }
        // Try handleReply method (older format)
        else if (command.handleReply && typeof command.handleReply === 'function') {
          await Promise.race([
            command.handleReply(runObj),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Reply timeout')), 300000)
            )
          ]);
          executed = true;
        }
        
        if (executed) {
          // Remove reply handler after successful execution
          handleReply.splice(replyIndex, 1);
        }
        
      } catch (error) {
        // Suppress common timeout and connection errors
        if (error.message && (
          error.message.includes('Reply timeout') ||
          error.message.includes('HandleEvent timeout') ||
          error.message.includes('Rate limit') ||
          error.message.includes('timeout') ||
          error.message.includes('ECONNRESET') ||
          error.message.includes('ETIMEDOUT')
        )) {
          // Silently ignore these common errors
        } else {
          logger.log(`Reply handler error for ${name}: ${error.message}`, "DEBUG");
        }
        
        // Remove failed reply handler to prevent memory leaks
        handleReply.splice(replyIndex, 1);
      }
      
    } catch (error) {
      logger.log(`HandleReply error: ${error.message}`, "DEBUG");
    }
  };
};
