
const axios = require('axios');
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "kiss",
  version: "2.0.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "Kiss the friend you tag with cute anime GIFs",
  commandCategory: "anime",
  usages: "kiss [@mention]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const { threadID, messageID, mentions } = event;
    
    if (!Object.keys(mentions).length) {
      return api.sendMessage("❤️ Please tag someone you want to kiss! 💋", threadID, messageID);
    }

    const mentionedUser = Object.keys(mentions)[0];
    const mentionedName = mentions[mentionedUser].replace("@", "");

    // Send loading message
    const loadingMsg = await api.sendMessage("💋 Preparing a sweet kiss... 💕", threadID);

    try {
      // Multiple backup APIs for kiss GIFs
      const kissApis = [
        "https://api.waifu.pics/sfw/kiss",
        "https://nekos.life/api/v2/img/kiss",
        "https://api.otakugifs.xyz/gif?reaction=kiss",
      ];

      let imageUrl = null;
      let apiUsed = null;

      // Try each API until one works
      for (let i = 0; i < kissApis.length; i++) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000 * i)); // Add delay between attempts
          
          const response = await axios.get(kissApis[i], { timeout: 10000 });
          
          if (response.data && (response.data.url || response.data.link)) {
            imageUrl = response.data.url || response.data.link;
            apiUsed = i + 1;
            break;
          }
        } catch (apiError) {
          console.log(`Kiss API ${i + 1} failed:`, apiError.message);
          continue;
        }
      }

      if (!imageUrl) {
        await api.unsendMessage(loadingMsg.messageID);
        return api.sendMessage("💔 Sorry, all kiss APIs are currently unavailable. Please try again later!", threadID, messageID);
      }

      // Download the image with retry logic
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const fileName = `kiss_${Date.now()}.gif`;
      const filePath = path.join(cacheDir, fileName);

      let downloadSuccess = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Progressive delay
          
          const imageResponse = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream',
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          const writer = fs.createWriteStream(filePath);
          imageResponse.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          downloadSuccess = true;
          break;
        } catch (downloadError) {
          console.log(`Download attempt ${attempt} failed:`, downloadError.message);
          if (attempt === 3) {
            await api.unsendMessage(loadingMsg.messageID);
            return api.sendMessage("💔 Failed to download kiss image. Please try again later!", threadID, messageID);
          }
        }
      }

      if (!downloadSuccess) {
        await api.unsendMessage(loadingMsg.messageID);
        return api.sendMessage("💔 Failed to prepare kiss image. Please try again later!", threadID, messageID);
      }

      // Prepare the kiss message
      const kissMessages = [
        `💋 *mwah* ${mentionedName}, you got a sweet kiss! 💕`,
        `😘 ${mentionedName}, someone wants to kiss you! 💋`,
        `💕 Aww, ${mentionedName} received a lovely kiss! 😘`,
        `💋 *smooch* ${mentionedName}, you're so kissable! 💖`,
        `😘 ${mentionedName}, here's a kiss full of love! 💕`
      ];

      const randomMessage = kissMessages[Math.floor(Math.random() * kissMessages.length)];

      await api.unsendMessage(loadingMsg.messageID);

      // Send the kiss image
      await api.sendMessage({
        body: randomMessage,
        mentions: [{
          tag: mentionedName,
          id: mentionedUser
        }],
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        // Clean up the file after sending
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.log("Error cleaning up kiss file:", cleanupError.message);
        }
      }, messageID);

      // Add reaction to the original message
      api.setMessageReaction("💋", messageID, (err) => {}, true);

    } catch (error) {
      console.log("Kiss command error:", error.message);
      try {
        await api.unsendMessage(loadingMsg.messageID);
      } catch (e) {}
      
      return api.sendMessage("💔 Something went wrong while preparing your kiss. Please try again!", threadID, messageID);
    }

  } catch (error) {
    console.log("Kiss command outer error:", error.message);
    return api.sendMessage("💔 An unexpected error occurred. Please try again later!", event.threadID, event.messageID);
  }
};
