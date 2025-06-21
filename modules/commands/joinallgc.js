const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "joinallgc",
  version: "2.0.0",
  hasPermssion: 3,
  credits: "TOHI-BOT-HUB",
  description: "Backup, restore and rejoin approved groups",
  usePrefix: true,
  commandCategory: "admin",
  usages: "backup | restore | rejoin | list",
  cooldowns: 10
};

const OWNER_ID = "100092006324917";

module.exports.run = async function ({ api, event, args }) {
  if (event.senderID !== OWNER_ID) {
    return api.sendMessage(`⛔️ শুধুমাত্র owner (${OWNER_ID}) এই কমান্ড ব্যবহার করতে পারবেন!`, event.threadID, event.messageID);
  }

  const { threadID, messageID } = event;
  const groupsDataPath = path.join(__dirname, '../../includes/database/data/groupsData.json');

  // Initialize groups database if not exists
  if (!fs.existsSync(groupsDataPath)) {
    fs.writeFileSync(groupsDataPath, JSON.stringify({}, null, 2));
  }

  // Load groups database
  let groupsData = {};
  try {
    groupsData = JSON.parse(fs.readFileSync(groupsDataPath, 'utf8'));
  } catch (error) {
    groupsData = {};
  }

  const command = (args[0] || "").toLowerCase();

  try {
    switch (command) {
      case "backup": {
        // Get bot's current groups
        const threadList = await api.getThreadList(100, null, ['INBOX']);
        const botGroups = threadList.filter(thread => thread.isGroup && thread.isSubscribed);

        if (botGroups.length === 0) {
          return api.sendMessage("📝 কোন গ্রুপে যোগ দেওয়া নেই backup করার জন্য!", threadID, messageID);
        }

        const currentTime = new Date().toLocaleString("bn-BD", {
          timeZone: "Asia/Dhaka"
        });

        let backupCount = 0;

        // Backup each group
        for (const group of botGroups) {
          try {
            const threadInfo = await api.getThreadInfo(group.threadID);

            // Store group data in groupsData.json
            groupsData[group.threadID] = {
              threadID: group.threadID,
              threadName: threadInfo.threadName || "Unknown Group",
              memberCount: threadInfo.participantIDs ? threadInfo.participantIDs.length : 0,
              isApproved: true,
              isPending: false,
              isRejected: false,
              backupDate: currentTime,
              status: "auto_backed_up",
              adminList: threadInfo.adminIDs || [],
              lastUpdated: currentTime,
              settings: {
                allowCommands: true,
                autoApprove: false
              }
            };

            backupCount++;

            // Add delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

          } catch (error) {
            console.log(`Backup failed for group ${group.threadID}: ${error.message}`);
          }
        }

        // Save groups database
        fs.writeFileSync(groupsDataPath, JSON.stringify(groupsData, null, 2), 'utf8');

        const successMsg = `✅ BACKUP সম্পূর্ণ হয়েছে!
📊 মোট গ্রুপ: ${backupCount}টি
📅 ব্যাকআপ সময়: ${currentTime}
💾 সেভ লোকেশন: groupsData.json

📝 Note: সব গ্রুপের ডেটা groupsData.json এ সেভ করা হয়েছে।`;

        return api.sendMessage(successMsg, threadID, messageID);
      }

      case "restore": {
        const approvedGroups = Object.values(groupsData).filter(group => group.isApproved);

        if (approvedGroups.length === 0) {
          return api.sendMessage("📝 কোন approved গ্রুপ ডেটা পাওয়া যায়নি restore করার জন্য!", threadID, messageID);
        }

        let restoreMsg = `📋 RESTORE INFORMATION:\n\n`;
        restoreMsg += `✅ মোট approved গ্রুপ: ${approvedGroups.length}টি\n\n`;

        approvedGroups.forEach((group, index) => {
          restoreMsg += `${index + 1}. ${group.threadName}\n`;
          restoreMsg += `   ID: ${group.threadID}\n`;
          restoreMsg += `   Members: ${group.memberCount}\n`;
          restoreMsg += `   Backup: ${group.backupDate}\n\n`;
        });

        restoreMsg += `💡 এই গ্রুপগুলোতে rejoin করতে "joinallgc rejoin" কমান্ড ব্যবহার করুন।`;

        return api.sendMessage(restoreMsg, threadID, messageID);
      }

      case "rejoin": {
        const approvedGroups = Object.values(groupsData).filter(group => group.isApproved);

        if (approvedGroups.length === 0) {
          return api.sendMessage("📝 কোন approved গ্রুপ ডেটা পাওয়া যায়নি rejoin করার জন্য!", threadID, messageID);
        }

        api.sendMessage(`🔄 ${approvedGroups.length}টি গ্রুপে rejoin শুরু করা হচ্ছে...`, threadID);

        const results = [];
        let successCount = 0;
        let failCount = 0;

        for (const group of approvedGroups) {
          try {
            // Check if bot is already in the group
            const threadInfo = await api.getThreadInfo(group.threadID);
            const botUserID = api.getCurrentUserID();

            if (threadInfo.participantIDs.includes(botUserID)) {
              results.push(`✅ ${group.threadName} - Already joined`);
              successCount++;
            } else {
              // Note: Auto-joining requires invitation from group members
              results.push(`⏳ ${group.threadName} - Rejoin attempt (manual invitation may be needed)`);

              // Update group status in database
              groupsData[group.threadID] = {
                ...groupsData[group.threadID],
                lastRejoinAttempt: new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" }),
                rejoinStatus: "attempted"
              };
            }

            // Add delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));

          } catch (error) {
            results.push(`❌ ${group.threadName} - Rejoin failed`);
            failCount++;
          }
        }

        // Save updated groups database
        fs.writeFileSync(groupsDataPath, JSON.stringify(groupsData, null, 2), 'utf8');

        const resultMsg = `🎯 REJOIN RESULTS:\n\n${results.join('\n')}\n\n✅ Success: ${successCount}\n❌ Failed: ${failCount}\n\n💡 Note: Bot can only join groups through manual invitation by group members.`;

        return api.sendMessage(resultMsg, threadID, messageID);
      }

      case "list": {
        const allGroups = Object.values(groupsData);
        const approvedGroups = allGroups.filter(group => group.isApproved);
        const pendingGroups = allGroups.filter(group => group.isPending);
        const rejectedGroups = allGroups.filter(group => group.isRejected);

        let listMsg = `📊 GROUP DATABASE STATUS:\n\n`;
        listMsg += `✅ Approved: ${approvedGroups.length}\n`;
        listMsg += `⏳ Pending: ${pendingGroups.length}\n`;
        listMsg += `❌ Rejected: ${rejectedGroups.length}\n`;
        listMsg += `📁 Total: ${allGroups.length}\n\n`;

        if (approvedGroups.length > 0) {
          listMsg += `✅ APPROVED GROUPS:\n`;
          approvedGroups.slice(0, 10).forEach((group, index) => {
            listMsg += `${index + 1}. ${group.threadName}\n`;
          });
          if (approvedGroups.length > 10) {
            listMsg += `... এবং আরো ${approvedGroups.length - 10}টি\n`;
          }
        }

        listMsg += `\n💾 Data stored in: groupsData.json`;

        return api.sendMessage(listMsg, threadID, messageID);
      }

      default: {
        const helpMsg = `📋 JOINALLGC COMMANDS:

🔄 joinallgc backup
   - বর্তমান গ্রুপগুলো backup করুন

📋 joinallgc restore  
   - Backup করা গ্রুপের তালিকা দেখুন

🔄 joinallgc rejoin
   - Backup করা গ্রুপগুলোতে rejoin করুন

📊 joinallgc list
   - গ্রুপ database স্ট্যাটাস দেখুন

💾 সব ডেটা groupsData.json এ সেভ হয়`;

        return api.sendMessage(helpMsg, threadID, messageID);
      }
    }

  } catch (error) {
    console.error("JoinAllGC Error:", error);
    return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
  }
};