
module.exports.config = {
  name: "offbot",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "TOHI-BOT-HUB",
  description: "Bot safely off/shutdown করে দেয়",
  commandCategory: "admin",
  usages: "offbot",
  cooldowns: 5,
  usePrefix: true,
  dependencies: {
    "process": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  
  // Check if user is admin
  if (!global.config.ADMINBOT.includes(senderID)) {
    return api.sendMessage("❌ আপনার এই command ব্যবহার করার permission নেই। শুধুমাত্র admin এই command ব্যবহার করতে পারে।", threadID, messageID);
  }

  try {
    // Send goodbye message
    const offMessage = await api.sendMessage(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤖 **TOHI-BOT-HUB SHUTDOWN**
┃
┃  🔴 Bot shutdown process শুরু হচ্ছে...
┃  💔 সব processes বন্ধ করা হচ্ছে
┃  👋 বিদায় নিচ্ছি সবার কাছ থেকে
┃
┃  📊 **Final Status:**
┃  ⚡ Commands: Disabled
┃  🔒 Events: Stopped
┃  🌐 Server: Shutting down
┃
┃  💝 **ধন্যবাদ সবাইকে!**
┃  🔄 পুনরায় চালু করতে main process restart করুন
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🕒 Shutdown Time: ${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}
🚩 **Made by TOHIDUL**`, threadID);

    console.log(`[OFFBOT] Bot shutdown initiated by admin ${senderID} at ${new Date().toISOString()}`);

    // Wait 3 seconds before shutdown
    setTimeout(async () => {
      try {
        // Update message
        await api.editMessage("✅ Bot সফলভাবে off হয়ে গেছে! 👋", offMessage.messageID, threadID);
        
        // Final log
        console.log(`[OFFBOT] TOHI-BOT-HUB is shutting down gracefully...`);
        console.log(`[OFFBOT] Goodbye! 👋`);
        
        // Clear all intervals and timeouts
        if (global.client) {
          // Clear any running intervals
          if (global.client.intervals) {
            global.client.intervals.forEach(interval => clearInterval(interval));
          }
          
          // Clear any running timeouts
          if (global.client.timeouts) {
            global.client.timeouts.forEach(timeout => clearTimeout(timeout));
          }
        }

        // Graceful shutdown
        setTimeout(() => {
          process.exit(0); // Clean exit
        }, 1000);
        
      } catch (error) {
        console.error("[OFFBOT] Error during graceful shutdown:", error.message);
        // Force exit if graceful shutdown fails
        process.exit(1);
      }
    }, 3000);

  } catch (error) {
    console.error("[OFFBOT] Error:", error.message);
    api.sendMessage(`❌ Bot off করতে সমস্যা হয়েছে: ${error.message}`, threadID, messageID);
  }
};

module.exports.languages = {
  "en": {
    "shutdownSuccess": "✅ Bot shutdown successfully!",
    "shutdownFailed": "❌ Failed to shutdown bot",
    "noPermission": "❌ You don't have permission to use this command"
  },
  "bd": {
    "shutdownSuccess": "✅ Bot সফলভাবে off হয়েছে!",
    "shutdownFailed": "❌ Bot off করতে ব্যর্থ",
    "noPermission": "❌ আপনার এই command ব্যবহার করার permission নেই"
  }
};
