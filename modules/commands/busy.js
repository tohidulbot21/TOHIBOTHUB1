module.exports.config = {
  name: "busy",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TOHI-BOT-HUB",
  description: "Set busy mode to auto-reply when mentioned",
  commandCategory: "System",
  usages: "[reason] or off",
  cooldowns: 3,
  usePrefix: true
};

module.exports.run = async function({ api, event, args, Users }) {
  const { senderID, threadID, messageID } = event;

  try {
    const userData = await Users.getData(senderID);

    if (args[0] && args[0].toLowerCase() === "off") {
      // Turn off busy mode
      userData.data.busy = false;
      await Users.setData(senderID, userData);

      return api.sendMessage("✅ Busy Mode বন্ধ হয়েছে", threadID, messageID);
    }

    // Turn on busy mode
    const reason = args.join(" ");
    userData.data.busy = reason || true;
    await Users.setData(senderID, userData);

    // Get user name with fallback
    let userName = `User-${senderID.slice(-6)}`;
    try {
      const userInfo = await api.getUserInfo(senderID);
      if (userInfo && userInfo[senderID] && userInfo[senderID].name) {
        userName = userInfo[senderID].name;
      }
    } catch (userInfoError) {
      // Use fallback name if getUserInfo fails
    }

    const successMessage = reason ? 
      `✅ Busy Mode চালু হয়েছে\n📝 কারণ: ${reason}\n🔓 বন্ধ করতে: /busy off`
      : `✅ Busy Mode চালু হয়েছে\n🔓 বন্ধ করতে: /busy off`;

    return api.sendMessage(successMessage, threadID, messageID);

  } catch (error) {
    console.error("Busy command error:", error);
    return api.sendMessage("❌ Error setting busy mode", threadID, messageID);
  }
};

module.exports.handleEvent = async function({ api, event, Users }) {
  const { type, body, senderID, threadID, mentions } = event;

  if (type !== "message" && type !== "message_reply") return;

  try {
    // Check if bot is mentioned
    const botID = api.getCurrentUserID();
    const isMentioned = mentions && Object.keys(mentions).includes(botID);

    if (!isMentioned) return;

    // Get mentioned user's data
    const mentionedUsers = Object.keys(mentions);

    for (const userID of mentionedUsers) {
      if (userID === botID) continue; // Skip bot itself

      try {
        const userData = await Users.getData(userID);

        if (userData.data && userData.data.busy) {
          let userName = `User-${userID.slice(-6)}`;

          try {
            // Try to get user name with better error handling
            const userInfo = await api.getUserInfo(userID);
            if (userInfo && userInfo[userID] && userInfo[userID].name) {
              userName = userInfo[userID].name;
            }
          } catch (userInfoError) {
            // Silent fallback to default name
          }

          const busyReason = typeof userData.data.busy === "string" ? userData.data.busy : "Busy";
          const busyMessage = `🔴 ${userName} এখন Busy আছে\n📝 কারণ: ${busyReason}`;

          api.sendMessage(busyMessage, threadID);
          break; // Only send one busy message per event
        }
      } catch (userDataError) {
        // Skip this user if data can't be retrieved
        continue;
      }
    }
  } catch (error) {
    // Silent error handling for handleEvent
    console.error("Busy handleEvent error:", error);
  }
};