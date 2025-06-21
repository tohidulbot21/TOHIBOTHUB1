
const fs = require("fs");

module.exports.config = {
  name: "autoreact",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TOHI-BOT-HUB",
  description: "Auto react to messages with random emojis",
  commandCategory: "group",
  usages: "[on/off]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.run = async function({ api, event, args, Threads }) {
  const { threadID, messageID, senderID } = event;
  
  if (!args[0]) {
    return api.sendMessage("⚠️ Please specify 'on' or 'off'", threadID, messageID);
  }

  const action = args[0].toLowerCase();
  
  if (action !== "on" && action !== "off") {
    return api.sendMessage("⚠️ Please use 'on' or 'off'", threadID, messageID);
  }

  try {
    let threadData = await Threads.getData(threadID);
    
    if (!threadData.autoreact) {
      threadData.autoreact = false;
    }

    if (action === "on") {
      if (threadData.autoreact === true) {
        return api.sendMessage("✅ Auto react is already enabled!", threadID, messageID);
      }
      
      threadData.autoreact = true;
      await Threads.setData(threadID, threadData);
      
      return api.sendMessage("✅ Auto react has been enabled! 🎉", threadID, messageID);
      
    } else if (action === "off") {
      if (threadData.autoreact === false) {
        return api.sendMessage("❌ Auto react is already disabled!", threadID, messageID);
      }
      
      threadData.autoreact = false;
      await Threads.setData(threadID, threadData);
      
      return api.sendMessage("❌ Auto react has been disabled!", threadID, messageID);
    }

  } catch (error) {
    console.error("Auto react error:", error);
    return api.sendMessage("❌ An error occurred while updating auto react settings.", threadID, messageID);
  }
};

module.exports.handleEvent = async function({ api, event, Threads }) {
  const { threadID, messageID, senderID, body } = event;
  
  // Don't react to bot's own messages or system messages
  if (senderID === api.getCurrentUserID() || !body) return;
  
  try {
    const threadData = await Threads.getData(threadID);
    
    if (!threadData.autoreact) return;
    
    // Random chance to react (30% chance)
    if (Math.random() > 0.3) return;
    
    // Array of random emojis
    const emojis = ["❤️", "😍", "😂", "😮", "😢", "😠", "👍", "👎", "🔥", "💯", "😎", "🥰", "😘", "🤔", "👏", "🎉", "💖", "✨", "🌟", "⭐"];
    
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    // React to the message
    api.setMessageReaction(randomEmoji, messageID, (err) => {
      if (err) console.error("Reaction error:", err);
    }, true);
    
  } catch (error) {
    console.error("Auto react handle event error:", error);
  }
};
