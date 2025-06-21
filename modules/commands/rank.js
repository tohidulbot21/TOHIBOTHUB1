const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "rank",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TOHI-BOT-HUB",
  description: "Show user rank based on experience and messages",
  usePrefix: true,
  commandCategory: "user",
  usages: "[page] or [@mention]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users, Currencies }) {
  const { threadID, senderID, messageID, mentions } = event;
  const config = require(process.cwd() + "/config.json");
  const prefix = config.PREFIX || "/";

  try {
    // Check if user wants to see specific user's rank
    const mention = Object.keys(mentions)[0];
    const targetID = mention || (event.type === "message_reply" ? event.messageReply.senderID : senderID);

    if (mention || event.type === "message_reply") {
      // Show specific user's rank
      const userData = await Currencies.getData(targetID);
      const userDataInfo = await Users.getData(targetID);
      let userName = userDataInfo.name;
      const userExp = userData.exp || 0;
      const userLevel = Math.floor((Math.sqrt(1 + (4 * userExp / 3) + 1) / 2));

      // Get all users data to calculate rank
      const allUsers = global.data.allUserID || [];
      const userRankings = [];

      // Ensure we have users to process
      if (allUsers.length === 0) {
        return api.sendMessage("❌ No user data found to calculate rankings!", threadID, messageID);
      }

      const seenNames = new Set();
      for (const uid of allUsers) {
        try {
          const data = await Currencies.getData(uid);
          const userData = await Users.getData(uid);
          if (!userData || !userData.name) continue;

          let name = userData.name;
          const exp = data.exp || 0;
          const level = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));

          // Check for duplicate names and add UID suffix if needed
          if (seenNames.has(name)) {
            name = `${name} (${uid.slice(-4)})`;
          }
          seenNames.add(userData.name);

          userRankings.push({ uid, name, exp, level });
        } catch (err) {
          continue;
        }
      }

      // Sort by experience
      userRankings.sort((a, b) => b.exp - a.exp);

      // Find user's rank
      const userRank = userRankings.findIndex(user => user.uid === targetID) + 1;

      const rankMsg = `╭─╼⃝⸙͎༄❀ 𝑼𝒔𝒆𝒓 𝑹𝒂𝒏𝒌 ❀༄⸙⃝╾─╮\n` +
                    `👤 𝑵𝒂𝒎𝒆: ${userName}\n` +
                    `🏆 𝑹𝒂𝒏𝒌: #${userRank}/${userRankings.length}\n` +
                    `⭐ 𝑳𝒆𝒗𝒆𝒍: ${userLevel}\n` +
                    `💫 𝑬𝒙𝒑: ${userExp.toLocaleString()}\n` +
                    `📊 𝑷𝒓𝒐𝒈𝒓𝒆𝒔𝒔: ${userRank <= 10 ? "🔥 Top 10!" : userRank <= 50 ? "⚡ Top 50!" : "📈 Keep going!"}\n` +
                    `╰─⃝⸙͎༄❀ 𝑻𝑶𝑯𝑰-𝑩𝑶𝑻 ❀༄⸙⃝─╯`;

      return api.sendMessage(rankMsg, threadID, messageID);
    }

    // Show leaderboard
    const page = parseInt(args[0]) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Get all users data
    const allUsers = global.data.allUserID || [];
    const userRankings = [];

    // Ensure we have users to process
    if (allUsers.length === 0) {
      return api.sendMessage("❌ No user data found to calculate rankings!", threadID, messageID);
    }

    const seenNames = new Set();
    for (const uid of allUsers) {
      try {
        const data = await Currencies.getData(uid);
        const userData = await Users.getData(uid);
        if (!userData || !userData.name) continue;

        let name = userData.name;
        const exp = data.exp || 0;
        const level = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));

        if (exp > 0) { // Only include users with experience
          // Check for duplicate names and add UID suffix if needed
          if (seenNames.has(name)) {
            name = `${name} (${uid.slice(-4)})`;
          }
          seenNames.add(userData.name);

          userRankings.push({ uid, name, exp, level });
        }
      } catch (err) {
        continue;
      }
    }

    // Sort by experience (highest first)
    userRankings.sort((a, b) => b.exp - a.exp);

    const totalPages = Math.ceil(userRankings.length / limit);
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, userRankings.length);

    if (startIndex >= userRankings.length) {
      return api.sendMessage(`❌ Page ${page} doesn't exist! Total pages: ${totalPages}`, threadID, messageID);
    }

    // Build leaderboard message
    let leaderboard = `╭─╼⃝⸙͎༄❀ 𝑹𝒂𝒏𝒌 𝑳𝒆𝒂𝒅𝒆𝒓𝒃𝒐𝒂𝒓𝒅 ❀༄⸙⃝╾─╮\n`;
    leaderboard += `📊 Page ${page}/${totalPages} | Total Users: ${userRankings.length}\n`;
    leaderboard += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    for (let i = startIndex; i < endIndex; i++) {
      const user = userRankings[i];
      const rank = i + 1;
      let medal = "";

      if (rank === 1) medal = "🥇";
      else if (rank === 2) medal = "🥈";
      else if (rank === 3) medal = "🥉";
      else if (rank <= 10) medal = "🏆";
      else if (rank <= 50) medal = "⭐";
      else medal = "📊";

      const shortName = user.name.length > 12 ? user.name.substring(0, 12) + "..." : user.name;
      leaderboard += `${medal} #${rank} | ${shortName}\n`;
      leaderboard += `   ⭐ Lv.${user.level} | 💫 ${user.exp.toLocaleString()} exp\n`;
      leaderboard += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    }

    // Find current user's rank
    const userRank = userRankings.findIndex(user => user.uid === senderID) + 1;
    if (userRank > 0) {
      leaderboard += `\n👤 Your Rank: #${userRank} | Lv.${userRankings[userRank-1].level}\n`;
    }

    leaderboard += `\n💡 Use: ${prefix}rank [@mention] - Check someone's rank\n`;
    leaderboard += `💡 Use: ${prefix}rank [page] - Navigate pages\n`;
    leaderboard += `╰─⃝⸙͎༄❀ 𝑻𝑶𝑯𝑰-𝑩𝑶𝑻 ❀༄⸙⃝─╯`;

    return api.sendMessage(leaderboard, threadID, messageID);

  } catch (error) {
    console.error('Rank command error:', error);
    return api.sendMessage("❌ An error occurred while fetching rank data!", threadID, messageID);
  }
};