const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "groupApprovalCheck",
  eventType: ["message"],
  version: "1.0.0",
  credits: "TOHI-BOT-HUB",
  description: "Check if group is approved before allowing commands"
};

module.exports.run = async function({ api, event, Groups }) {
  try {
    const { threadID, isGroup } = event;

    // Only check for group messages
    if (!isGroup) return;

    const prefix = global.config.PREFIX || '*';

    // Check if message starts with prefix (is a command)
    if (!event.body || !event.body.startsWith(prefix)) return;

    // Check group approval status
    const isApproved = Groups.isApproved(threadID);
    const isPending = Groups.isPending(threadID);
    const isRejected = Groups.isRejected(threadID);

    if (isRejected) {
      // Group is rejected - bot should leave or stay silent
      return;
    } else if (isPending || !isApproved) {
      // Group is not approved yet
      let groupData = Groups.getData(threadID);

      if (!groupData) {
        // Create group data if doesn't exist
        try {
          groupData = await Groups.createData(threadID);
          Groups.addToPending(threadID);

          api.sendMessage(
            `⚠️ এই গ্রুপটি এখনো approve করা হয়নি!\n\n` +
            `🆔 Group ID: ${threadID}\n` +
            `📊 Status: Pending Approval\n\n` +
            `🚫 Bot commands কাজ করবে না যতক্ষণ না approve হয়।\n` +
            `👑 Admin: ${global.config.ADMINBOT?.[0] || 'Unknown'}`,
            event.threadID
          );

          // Notify admin
          if (global.config.ADMINBOT && global.config.ADMINBOT[0]) {
            api.sendMessage(
              `🔔 নতুন গ্রুপ approval এর জন্য অপেক্ষা করছে:\n\n` +
              `📝 Group: ${groupData ? groupData.threadName : 'Unknown'}\n` +
              `🆔 ID: ${threadID}\n` +
              `👥 Members: ${groupData ? groupData.memberCount : 0}\n\n` +
              `✅ Approve: ${prefix}approve ${threadID}\n` +
              `❌ Reject: ${prefix}approve reject ${threadID}`,
              global.config.ADMINBOT[0]
            );
          }
        } catch (error) {
          console.error('Error handling new group:', error);
        }
      } else {
        // Group exists but not approved
        api.sendMessage(
          `🚫 এই গ্রুপটি এখনো approve করা হয়নি!\n\n` +
          `📊 Status: ${groupData.status}\n` +
          `⏰ Admin approval এর জন্য অপেক্ষা করুন।\n\n` +
          `👑 Bot Admin: ${global.config.ADMINBOT?.[0] || 'Unknown'}`,
          event.threadID
        );
      }

      // Prevent command execution
      event.preventDefault = true;
      return false;
    }

    // Group is approved - allow command execution
    return true;

  } catch (error) {
    console.error('Error in groupApprovalCheck:', error);
    return true; // Allow command execution on error to prevent bot from breaking
  }
};