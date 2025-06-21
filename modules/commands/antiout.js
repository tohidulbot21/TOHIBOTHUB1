
module.exports.config = {
  name: "antiout",
  version: "2.0.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "🛡️ Anti-Out system - Automatically re-add users who leave the group",
  commandCategory: "Group Management",
  usages: "[on/off/status]",
  cooldowns: 3,
  dependencies: {
    "fs-extra": ""
  }
};

const fs = require('fs-extra');

// Stylish text function
function stylishText(text, style = "default") {
  const styles = {
    default: `✨ ${text} ✨`,
    title: `🎭 ${text} 🎭`,
    subtitle: `🌟 ${text} 🌟`,
    warning: `⚠️ ${text} ⚠️`,
    success: `✅ ${text} ✅`,
    error: `❌ ${text} ❌`,
    bangla: `🇧🇩 ${text} 🇧🇩`,
    love: `💖 ${text} 💖`,
    fire: `🔥 ${text} 🔥`,
    boss: `👑 ${text} 👑`,
    antiout: `🛡️ ${text} 🛡️`
  };
  return styles[style] || styles.default;
}

module.exports.run = async function({ api, event, args, Threads }) {
  const { threadID, senderID } = event;
  const input = args[0] ? args[0].toLowerCase() : "status";

  try {
    // Get thread info for bot admin check
    const info = await api.getThreadInfo(threadID);

    // Get current thread data
    const data = (await Threads.getData(threadID)).data || {};
    const currentTime = new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka", hour12: false });

    switch (input) {
      case "on":
        // Enable anti-out (removed admin check)
        data["antiout"] = true;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(parseInt(threadID), data);

        const onMessage = `
╔════════════════════════════╗
  🛡️ 𝘼𝙉𝙏𝙄-𝙊𝙐𝙏 𝘼𝘾𝙏𝙄𝙑𝘼𝙏𝙀𝘿 🛡️
╚════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅ Anti-Out সফলভাবে চালু হয়েছে!
┃
┃  🔒 এখন কেউ গ্রুপ ছাড়লে আবার এড করার চেষ্টা হবে
┃  💪 পালানোর কোনো উপায় নেই!
┃  🚫 Self-leave সম্পূর্ণ নিষিদ্ধ
┃
┃  💡 **নোট:** বট এডমিন হলে আরো ভালো কাজ করবে
┃  🛡️  **স্ট্যাটাস:** ACTIVE & MONITORING
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🕒 **সময়:** ${currentTime}
🚩 **Made by TOHIDUL**`;

        console.log(`[ANTIOUT] Enabled for group ${threadID} by user ${senderID}`);
        return api.sendMessage(onMessage, threadID);

      case "off":
        // Disable anti-out
        data["antiout"] = false;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(parseInt(threadID), data);

        const offMessage = `
╔════════════════════════════╗
  🔓 𝘼𝙉𝙏𝙄-𝙊𝙐𝙏 𝘿𝙀𝘼𝘾𝙏𝙄𝙑𝘼𝙏𝙀𝘿 🔓
╚════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ❌ Anti-Out সফলভাবে বন্ধ হয়েছে!
┃
┃  🔓 এখন কেউ চাইলে গ্রুপ ছেড়ে যেতে পারবে
┃  😔 আর ফেরত আনা হবে না
┃  🚪 Normal leave/exit অনুমতি আছে
┃
┃  💡 **পুনরায় চালু করতে:** /antiout on
┃  🛡️ **স্ট্যাটাস:** DISABLED
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🕒 **সময়:** ${currentTime}
🚩 **Made by TOHIDUL**`;

        console.log(`[ANTIOUT] Disabled for group ${threadID} by user ${senderID}`);
        return api.sendMessage(offMessage, threadID);

      case "status":
      default:
        const isAntiOutEnabled = data.antiout === true;
        const isBotAdmin2 = info.adminIDs.some(item => item.id == api.getCurrentUserID());
        
        const statusMessage = `
╔════════════════════════════╗
  🛡️ 𝘼𝙉𝙏𝙄-𝙊𝙐𝙏 𝙎𝙏𝘼𝙏𝙐𝙎 🛡️
╚════════════════════════════╝

📊 **বর্তমান অবস্থা:** ${isAntiOutEnabled ? '🟢 চালু' : '🔴 বন্ধ'}
🤖 **বট এডমিন স্ট্যাটাস:** ${isBotAdmin2 ? '✅ এডমিন' : '❌ এডমিন নয়'}
👥 **গ্রুপ আইডি:** ${threadID}

🔧 **ব্যবহার:**
   • \`/antiout on\` - Anti-Out চালু করুন
   • \`/antiout off\` - Anti-Out বন্ধ করুন
   • \`/antiout status\` - বর্তমান অবস্থা দেখুন

💡 **বৈশিষ্ট্য:**
   • কেউ গ্রুপ ছাড়লে আবার এড করার চেষ্টা হবে
   • যে কেউ ব্যবহার করতে পারবেন
   • বট এডমিন হলে ১০০% সফল হবে

${!isBotAdmin2 ? '\n💡 **পরামর্শ:** বটকে গ্রুপ এডমিন বানালে আরো ভালো কাজ করবে।' : ''}

🕒 **সময়:** ${currentTime}
🚩 **Made by TOHIDUL**`;

        console.log(`[ANTIOUT] Status checked for group ${threadID} - Status: ${isAntiOutEnabled ? 'ENABLED' : 'DISABLED'}`);
        return api.sendMessage(statusMessage, threadID);
    }

  } catch (error) {
    console.error('[ANTIOUT] Command error:', error);
    return api.sendMessage(
      `${stylishText("System Error!", "error")}\n\n❌ Anti-Out কমান্ড প্রসেসিং এ সমস্যা হয়েছে।\n\n🔧 Error: ${error.message}\n\n🚩 Made by TOHIDUL`, 
      threadID
    );
  }
};
