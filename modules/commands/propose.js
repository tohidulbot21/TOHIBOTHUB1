const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

module.exports.config = {
  name: "propose",
  version: "1.0.1",
  hasPermssion: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "Propose to someone with a beautiful image",
  commandCategory: "love",
  usages: "[tag]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.onLoad = async () => {
  const dirMaterial = __dirname + `/cache/canvas/`;
  if (!fs.existsSync(dirMaterial)) {
    fs.mkdirSync(dirMaterial, { recursive: true });
  }
  
  // Download background image if not exists
  if (!fs.existsSync(dirMaterial + "totinh.png")) {
    try {
      console.log("[PROPOSE] Downloading background image...");
      const backgroundUrls = [
        "https://i.imgur.com/AC7pnk1.jpg",
        "https://i.ibb.co/9ZQX8Kp/propose-bg.png",
        "https://i.imgur.com/ep1gG3r.png"
      ];
      
      let downloaded = false;
      for (let i = 0; i < backgroundUrls.length && !downloaded; i++) {
        try {
          const response = await axios.get(backgroundUrls[i], { 
            responseType: 'stream',
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          const writer = fs.createWriteStream(dirMaterial + "totinh.png");
          response.data.pipe(writer);
          
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
          
          console.log("[PROPOSE] Background image downloaded successfully");
          downloaded = true;
        } catch (error) {
          console.log(`[PROPOSE] Failed to download from URL ${i + 1}: ${error.message}`);
        }
      }
      
      if (!downloaded) {
        console.log("[PROPOSE] All download attempts failed, command may not work properly");
      }
    } catch (error) {
      console.log("[PROPOSE] Error setting up background:", error.message);
    }
  }
};

async function makeImage({ one, two }) {
  // Canvas functionality disabled due to system requirements
  return null;
}

module.exports.run = async function ({ event, api, args, Users }) {
  try {
    const { threadID, messageID, senderID } = event;

    // Get mentioned user
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      return api.sendMessage("❌ Please tag someone to propose to!\nExample: /propose @username", threadID, messageID);
    }

    const taggedName = event.mentions[mention].replace("@", "");

    // Check if user is trying to propose to themselves
    if (mention === senderID) {
      return api.sendMessage("😅 You can't propose to yourself! Tag someone else.", threadID, messageID);
    }

    // Send the proposal (text only due to system limitations)
    return api.sendMessage({
      body: `💕 ${taggedName}, someone has a special question for you! 💕\n\n"Will you be mine? 💖"\n\n🌹 Made with love by TOHI-BOT-HUB 🌹\n\n📝 Note: Image generation temporarily unavailable`,
      mentions: [{
        tag: taggedName,
        id: mention
      }]
    }, threadID, messageID);

  } catch (error) {
    console.error("[PROPOSE] Main error:", error.message);
    return api.sendMessage(
      "❌ **System Error**\n\n" +
      "• An unexpected error occurred\n" +
      "• Please try again later\n\n" +
      `🔧 **Error:** ${error.message}\n\n` +
      "📞 **Contact:** Report this to bot admin\n" +
      "🚩 **Made by TOHI-BOT-HUB**",
      event.threadID, event.messageID
    );
  }
};