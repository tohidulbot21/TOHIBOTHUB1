// Canvas removed to fix libuuid error
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

module.exports.config = {
  name: "king",
  aliases: ["raja","kng"],
  version: "1.0.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "Make a king proposal image with avatars",
  commandCategory: "love",
  usages: "[tag]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

const KING_BG_URL = "https://i.postimg.cc/vB55tT9V/king2.jpg";

module.exports.onLoad = async () => {
  const dirMaterial = __dirname + `/cache/canvas/`;
  if (!fs.existsSync(dirMaterial)) {
    fs.mkdirSync(dirMaterial, { recursive: true });
  }

  // Download king background image if not exists
  const kingBgPath = dirMaterial + "king_propose.png";
  if (!fs.existsSync(kingBgPath)) {
    try {
      console.log("[KING] Downloading king background image...");
      const response = await axios.get(KING_BG_URL, { 
        responseType: 'stream',
        timeout: 20000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const writer = fs.createWriteStream(kingBgPath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      console.log("[KING] King background image downloaded successfully");
    } catch (error) {
      console.log(`[KING] Failed to download king image: ${error.message}`);
    }
  }
};

async function downloadAvatar(userID, outputPath) {
  try {
    const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const response = await axios.get(avatarUrl, { 
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    fs.writeFileSync(outputPath, Buffer.from(response.data));
    return true;
  } catch (error) {
    console.log(`[KING] Failed to download avatar for ${userID}:`, error.message);
    return false;
  }
}

function drawCircularImage(ctx, image, x, y, size) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, x, y, size, size);
  ctx.restore();
}

async function makeImage({ one, two }) {
  // Canvas functionality disabled due to system requirements
  // Return null to indicate image generation is not available
  return null;
}

module.exports.run = async function ({ event, api, args }) {
  try {
    const { threadID, messageID, senderID } = event;
    
    // Get mentioned user
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      return api.sendMessage("❌ Please tag someone to make the king image with!\nExample: /king @username", threadID, messageID);
    }

    const taggedName = event.mentions[mention].replace("@", "");
    
    // Check if user is trying to king themselves
    if (mention === senderID) {
      return api.sendMessage("😅 You can't make yourself the king! Tag someone else.", threadID, messageID);
    }

    // Send processing message
    const processingMsg = await api.sendMessage("👑 Creating your KING image... Please wait!", threadID);

    try {
      // Create the king image
      const imagePath = await makeImage({ one: senderID, two: mention });
      
      // Remove processing message
      await api.unsendMessage(processingMsg.messageID);
      
      // Send the king proposal (text only due to system limitations)
      return api.sendMessage({
        body: `👑 ${taggedName}, you have been crowned by someone! 👑\n\n🌹 Made with love by TOHI-BOT-HUB 🌹\n\n📝 Note: Image generation temporarily unavailable`,
        mentions: [{
          tag: taggedName,
          id: mention
        }]
      }, threadID, messageID);
    } catch (imageError) {
      // Remove processing message
      await api.unsendMessage(processingMsg.messageID);
      
      console.error("[KING] Image creation failed:", imageError.message);
      return api.sendMessage(
        "❌ **KING Image Failed**\n\n" +
        "• Failed to create king image\n" +
        "• Please try again later\n\n" +
        `🔧 **Error:** ${imageError.message}\n\n` +
        "🚩 **Made by TOHI-BOT-HUB**",
        threadID, messageID
      );
    }
    
  } catch (error) {
    console.error("[KING] Main error:", error.message);
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