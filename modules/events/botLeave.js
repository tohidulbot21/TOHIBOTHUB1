const { writeFileSync, readFileSync } = require('fs');

module.exports.config = {
  name: "botLeave",
  eventType: ["log:thread-remove"],
  version: "1.0.0",
  credits: "TOHI-BOT-HUB",
  description: "Handle bot removal from groups"
};

module.exports.run = async function({ api, event, Groups }) {
  try {
    const { threadID, logMessageData } = event;

    if (logMessageData && logMessageData.leftParticipantFbId) {
      const botID = api.getCurrentUserID();

      // Check if the bot was removed
      if (logMessageData.leftParticipantFbId === botID) {
        console.log(`🚪 Bot removed from group: ${threadID}`);

        // Remove group from database
        const removed = Groups.removeGroup(threadID);

        if (removed) {
          console.log(`✅ Removed group data: ${threadID}`);
        } else {
          console.log(`⚠️ Could not remove group data: ${threadID}`);
        }
      }
    }
  } catch (error) {
    console.log(`⚠️ Error in botLeave event: ${error.message}`);
  }
};