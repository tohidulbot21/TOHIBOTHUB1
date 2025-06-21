
module.exports.config = {
  name: "fixuserdata",
  version: "1.0.0",
  hasPermssion: 2,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "Fix missing user data for all group members",
  commandCategory: "Admin",
  usages: "/fixuserdata [all|current]",
  cooldowns: 30
};

const OWNER_ID = "100092006324917";

module.exports.run = async function ({ api, event, args, Users }) {
  if (event.senderID !== OWNER_ID) {
    return api.sendMessage(`⛔️ শুধুমাত্র owner (${OWNER_ID}) এই কমান্ড ব্যবহার করতে পারবেন!`, event.threadID, event.messageID);
  }

  const { threadID, messageID } = event;
  const logger = require("../../utils/log.js");
  const command = (args[0] || "current").toLowerCase();

  try {
    if (command === "all") {
      // Fix user data for all approved groups
      const { configPath } = global.client;
      delete require.cache[require.resolve(configPath)];
      const config = require(configPath);
      
      if (!config.APPROVAL || !config.APPROVAL.approvedGroups) {
        return api.sendMessage("❌ কোনো approved গ্রুপ নেই!", threadID, messageID);
      }

      api.sendMessage(`🔄 সব approved গ্রুপের member data fix করা হচ্ছে...
      
📊 মোট গ্রুপ: ${config.APPROVAL.approvedGroups.length}টি
⏳ অনুগ্রহ করে অপেক্ষা করুন...`, threadID);

      let totalFixed = 0;
      let groupsProcessed = 0;

      for (const groupId of config.APPROVAL.approvedGroups) {
        try {
          const groupInfo = await api.getThreadInfo(groupId);
          
          for (const memberID of groupInfo.participantIDs) {
            try {
              if (!global.data.allUserID.includes(memberID)) {
                global.data.allUserID.push(memberID);
              }
              
              await Users.createData(memberID);
              totalFixed++;
              
              // Small delay to prevent rate limiting
              await new Promise(resolve => setTimeout(resolve, 50));
            } catch (memberError) {
              logger.log(`Warning: Could not fix data for member ${memberID}: ${memberError.message}`, 'WARN');
            }
          }
          
          groupsProcessed++;
          logger.log(`Fixed user data for group ${groupId} (${groupInfo.participantIDs.length} members)`, 'SUCCESS');
          
          // Delay between groups
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (groupError) {
          logger.log(`Error processing group ${groupId}: ${groupError.message}`, 'ERROR');
        }
      }

      return api.sendMessage(`✅ USER DATA FIX সম্পূর্ণ!

📊 প্রসেস করা গ্রুপ: ${groupsProcessed}টি
👥 Fix করা user: ${totalFixed} জন
⏰ সময়: ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}

✨ এখন সব rankup এবং অন্যান্য feature ঠিকমতো কাজ করবে!`, threadID, messageID);
      
    } else {
      // Fix user data for current group only
      if (!event.isGroup) {
        return api.sendMessage("❌ এটি একটি গ্রুপে ব্যবহার করুন!", threadID, messageID);
      }

      api.sendMessage("🔄 এই গ্রুপের member data fix করা হচ্ছে...", threadID);

      const groupInfo = await api.getThreadInfo(threadID);
      let fixedCount = 0;

      for (const memberID of groupInfo.participantIDs) {
        try {
          if (!global.data.allUserID.includes(memberID)) {
            global.data.allUserID.push(memberID);
          }
          
          await Users.createData(memberID);
          fixedCount++;
          
          // Small delay
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (memberError) {
          logger.log(`Warning: Could not fix data for member ${memberID}: ${memberError.message}`, 'WARN');
        }
      }

      return api.sendMessage(`✅ USER DATA FIX সম্পূর্ণ!

👥 Fix করা user: ${fixedCount} জন
📊 মোট member: ${groupInfo.participantIDs.length} জন
⏰ সময়: ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}

✨ এখন এই গ্রুপে সব feature ঠিকমতো কাজ করবে!`, threadID, messageID);
    }

  } catch (error) {
    logger.log(`Error in fixuserdata: ${error.message}`, 'ERROR');
    return api.sendMessage(`❌ Error হয়েছে: ${error.message}`, threadID, messageID);
  }
};
