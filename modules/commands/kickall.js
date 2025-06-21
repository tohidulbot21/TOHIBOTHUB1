module.exports.config = {
  name: "kickall",
  version: "1.0.0",
  permission: 2,
  credits: "TOHI-BOT-HUB",
  description: "Kick out all the member inside of the group.",
  commandCategory: "admin",
  usages: "[]",
  cooldowns: 3,
  usePrefix: true
};

module.exports.run = async function({ api, event, args }) {
  try {
    var threadInfo = await api.getThreadInfo(event.threadID);
    var id = threadInfo.participantIDs;
    
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (let user of id) {
      try {
        await delay(2000); // Reduced delay but still prevent rate limiting
        await new Promise((resolve, reject) => {
          api.removeUserFromGroup(user, event.threadID, (err) => {
            if (err) {
              // Silently handle common errors
              if (!err.message || (!err.message.includes('Rate limited') && 
                  !err.message.includes('not part of the conversation') &&
                  !err.message.includes('1545012'))) {
                failCount++;
              }
              resolve(); // Don't reject to continue with next user
            } else {
              successCount++;
              resolve();
            }
          });
        });
      } catch (error) {
        // Silently continue with next user
        failCount++;
      }
    }
    
    if (successCount > 0 || failCount > 0) {
      api.sendMessage(`Kickall completed. Success: ${successCount}, Failed: ${failCount}`, event.threadID);
    }
  } catch (error) {
    api.sendMessage("An error occurred while processing kickall command.", event.threadID);
  }
};