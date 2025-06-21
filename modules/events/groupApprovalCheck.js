const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "groupApprovalCheck",
  eventType: [], // Disabled to prevent conflicts with handleCommand
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

    // ========== STRICT GROUP APPROVAL CHECK ==========
    console.log(`🔍 Checking group approval for TID: ${threadID}`);

    // Step 1: Check if group data exists in groupsData.json
    const groupData = Groups.getData(threadID);

    if (!groupData) {
      // Group data doesn't exist - create and mark as pending
      console.log(`❌ Group ${threadID} not found in database. Adding to pending...`);

      try {
        // Create group data automatically
        const newGroupData = await Groups.createData(threadID);
        Groups.addToPending(threadID);

        // Send notification to group
        api.sendMessage(
          `⚠️ এই গ্রুপটি Bot database এ নেই!\n\n` +
          `🆔 Group ID: ${threadID}\n` +
          `📊 Status: ডেটাবেসে যোগ করা হয়েছে - Pending Approval\n\n` +
          `🚫 Bot commands কাজ করবে না যতক্ষণ না Admin approve করে।\n` +
          `👑 Bot Admin: ${global.config.ADMINBOT?.[0] || 'Unknown'}\n\n` +
          `💡 Admin কে বলুন: /approve ${threadID}`,
          threadID
        );

        // Notify admin about new group
        if (global.config.ADMINBOT && global.config.ADMINBOT[0]) {
          try {
            const groupInfo = await api.getThreadInfo(threadID);
            api.sendMessage(
              `🔔 নতুন গ্রুপ Database এ যোগ হয়েছে:\n\n` +
              `📝 Group: ${groupInfo.threadName || 'Unknown'}\n` +
              `🆔 TID: ${threadID}\n` +
              `👥 Members: ${groupInfo.participantIDs?.length || 0}\n\n` +
              `✅ Approve: /approve ${threadID}\n` +
              `❌ Reject: /approve reject ${threadID}`,
              global.config.ADMINBOT[0]
            );
          } catch (notifyError) {
            console.log(`Admin notification failed: ${notifyError.message}`);
          }
        }

      } catch (createError) {
        console.error('Error creating group data:', createError.message);
      }

      // Block command execution
      event.preventDefault = true;
      return false;
    }

    // Step 2: Check approval status from database
    const isApproved = groupData.status === 'approved';
    const isPending = groupData.status === 'pending';
    const isRejected = groupData.status === 'rejected';

    console.log(`📊 Group ${threadID} status: ${groupData.status} | Approved: ${isApproved}`);

    // Step 3: Handle based on status
    if (isRejected) {
      // Group is rejected - silent block
      console.log(`🚫 Group ${threadID} is REJECTED - blocking commands`);
      event.preventDefault = true;
      return false;
    }

    if (!isApproved || isPending) {
      // Group is not approved yet
      console.log(`⏳ Group ${threadID} is NOT APPROVED - blocking commands`);

      // Send notification (only once per session to avoid spam)
      if (!global.notifiedGroups) global.notifiedGroups = new Set();

      if (!global.notifiedGroups.has(threadID)) {
        api.sendMessage(
          `⚠️ এই গ্রুপটি এখনো approve করা হয়নি!\n\n` +
          `🆔 Group ID: ${threadID}\n` +
          `📊 Status: ${groupData.status.toUpperCase()}\n` +
          `⏰ Created: ${new Date(groupData.createdAt).toLocaleString('bn-BD')}\n\n` +
          `🚫 Bot commands কাজ করবে না যতক্ষণ না approve হয়।\n` +
          `👑 Bot Admin: ${global.config.ADMINBOT?.[0] || 'Unknown'}\n\n` +
          `💡 Admin থেকে approve করানোর জন্য অনুরোধ করুন`,
          threadID
        );
        global.notifiedGroups.add(threadID);
      }

      // Block command execution
      event.preventDefault = true;
      return false;
    }

    // Step 4: Group is approved - allow commands
    if (global.config.DeveloperMode) {
      console.log(`✅ Group ${threadID} is APPROVED - allowing commands`);
    }
    return true;

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