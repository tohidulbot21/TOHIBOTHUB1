module.exports.config = {
  name: "approve",
  version: "6.0.0",
  permission: 2,
  usePrefix: true,
  credits: "TOHIDUL (Easy Bangla Edition)",
  description: "Owner approval system — approved ছাড়া কোনো গ্রুপে বট কাজ করবে না।",
  commandCategory: "Admin",
  usages: "/approve [list|pending|help]",
  cooldowns: 5
};

const OWNER_ID = "100092006324917";

module.exports.run = async function ({ api, event, args }) {
  const logger = require("../../utils/log.js");
  if (event.senderID !== OWNER_ID) {
    return api.sendMessage(`⛔️ কেবল owner (${OWNER_ID}) approval দিতে পারবেন!`, event.threadID, event.messageID);
  }

  const { threadID, messageID } = event;
  const Groups = require('../../includes/database/groups')({ api });

  const command = (args[0] || "").toLowerCase();

  try {
    switch (command) {
      case "migrate": {
        api.sendMessage("🔄 পুরানো approved groups migrate করা হচ্ছে...", threadID, messageID);
        
        // Force migration
        Groups.updateSettings({ migrated: false });
        const migrated = Groups.migrateFromConfig();
        
        if (migrated) {
          const approvedGroups = Groups.getApprovedGroups();
          api.sendMessage(
            `✅ Migration সম্পূর্ণ!\n\n` +
            `📊 Total approved groups: ${approvedGroups.length}\n` +
            `🔄 এখন সব পুরানো approved groups এ bot কাজ করবে।`,
            threadID, messageID
          );
        } else {
          api.sendMessage("❌ Migration করতে সমস্যা হয়েছে!", threadID, messageID);
        }
        break;
      }

      case "help": {
        const helpMsg = `📋 APPROVE COMMAND HELP:

🔸 /approve — বর্তমান গ্রুপ approve করুন
🔸 /approve list — সব approved গ্রুপের লিস্ট
🔸 /approve pending — pending গ্রুপের লিস্ট
🔸 /approve migrate — পুরানো approved groups migrate করুন
🔸 /approve reject <groupID> — নির্দিষ্ট গ্রুপ reject করুন
🔸 /approve help — এই help মেসেজ

💡 Note: শুধু owner এই কমান্ড ব্যবহার করতে পারবেন।`;
        return api.sendMessage(helpMsg, threadID, messageID);
      }

      case "list": {
        const approvedGroups = Groups.getByStatus('approved');

        if (approvedGroups.length === 0) {
          return api.sendMessage("📝 কোনো approved গ্রুপ নেই!", threadID, messageID);
        }

        let msg = `✅ APPROVED GROUPS (${approvedGroups.length}):\n\n`;

        for (let i = 0; i < Math.min(approvedGroups.length, 15); i++) {
          const group = approvedGroups[i];
          msg += `${i + 1}. ${group.threadName || 'Unknown Group'}\n`;
          msg += `   🆔 ${group.threadID}\n`;
          msg += `   👥 ${group.memberCount || 0} members\n`;
          msg += `   📅 Approved: ${new Date(group.approvedAt || group.lastUpdated).toLocaleDateString('bn-BD')}\n\n`;
        }

        if (approvedGroups.length > 15) {
          msg += `... এবং আরও ${approvedGroups.length - 15}টি গ্রুপ`;
        }

        return api.sendMessage(msg, threadID, messageID);
      }

      case "pending": {
        const pendingGroups = Groups.getByStatus('pending');

        if (pendingGroups.length === 0) {
          return api.sendMessage("📝 কোনো pending গ্রুপ নেই!", threadID, messageID);
        }

        let msg = `⏳ PENDING GROUPS (${pendingGroups.length}):\n\n`;

        for (let i = 0; i < Math.min(pendingGroups.length, 10); i++) {
          const group = pendingGroups[i];
          msg += `${i + 1}. ${group.threadName || 'Unknown Group'}\n`;
          msg += `   🆔 ${group.threadID}\n`;
          msg += `   👥 ${group.memberCount || 0} members\n`;
          msg += `   📅 Pending since: ${new Date(group.pendingAt || group.createdAt).toLocaleDateString('bn-BD')}\n\n`;
        }

        if (pendingGroups.length > 10) {
          msg += `... এবং আরো ${pendingGroups.length - 10}টি গ্রুপ`;
        }

        return api.sendMessage(msg, threadID, messageID);
      }

      case "reject": {
        const targetID = args[1];
        if (!targetID) {
          return api.sendMessage("❌ Group ID দিন!\nExample: /approve reject 12345", threadID, messageID);
        }

        const success = Groups.rejectGroup(targetID);
        if (success) {
          const groupData = Groups.getData(targetID);
          const groupName = groupData ? groupData.threadName : 'Unknown Group';

          api.sendMessage(`❌ Group "${groupName}" reject করা হয়েছে!`, threadID, messageID);

          // Notify the group
          try {
            api.sendMessage(
              `❌ এই গ্রুপটি admin দ্বারা reject করা হয়েছে।\n\n` +
              `🚫 Bot এর কোনো command আর কাজ করবে না।\n` +
              `📞 আরো তথ্যের জন্য admin এর সাথে যোগাযোগ করুন।`,
              targetID
            );
          } catch (error) {
            console.log('Could not notify rejected group:', error.message);
          }
        } else {
          api.sendMessage("❌ Group reject করতে সমস্যা হয়েছে!", threadID, messageID);
        }
        break;
      }

      default: {
        // Approve current group or specified group
        const targetID = args[0] || threadID;

        if (Groups.isApproved(targetID)) {
          return api.sendMessage("✅ এই গ্রুপ ইতিমধ্যে approved!", threadID, messageID);
        }

        // Approve the group
        const success = Groups.approveGroup(targetID);

        if (success) {
          const groupData = Groups.getData(targetID);
          const groupName = groupData ? groupData.threadName : "Unknown Group";

          api.sendMessage(`✅ Group "${groupName}" approved successfully!`, threadID, messageID);

          // Send welcome message to approved group
          if (targetID !== threadID) {
            try {
              api.sendMessage(
                `🎉 অভিনন্দন! আপনার গ্রুপটি approve করা হয়েছে!\n\n` +
                `✅ Bot commands এখন active।\n` +
                `📝 Type ${global.config.PREFIX || '/'}help to see available commands.\n` +
                `👑 Bot Admin: ${OWNER_ID}`,
                targetID
              );
            } catch (error) {
              logger.log(`Could not send welcome message: ${error.message}`, 'WARN');
            }
          }

        } else {
          api.sendMessage("❌ Group approve করতে সমস্যা হয়েছে!", threadID, messageID);
        }
      }
    }
  } catch (error) {
    console.error("Approve command error:", error);
    return api.sendMessage("❌ কিছু ভুল হয়েছে! আবার চেষ্টা করুন।", threadID, messageID);
  }
};