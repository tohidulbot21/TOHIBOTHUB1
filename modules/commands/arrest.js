
module.exports.config = {
  name: "arrest",
  version: "3.0.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB | Rewritten by TOHIDUL",
  description: "Arrest a friend you mention with a stylish image",
  commandCategory: "tagfun",
  usages: "[mention]",
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "canvas": ""
  }
};

const OWNER_UIDS = ["100092006324917"];

module.exports.onLoad = async () => {
  const { resolve } = require("path");
  const { existsSync, mkdirSync } = require("fs-extra");
  const axios = require("axios");
  const fs = require("fs-extra");
  
  const dirMaterial = __dirname + `/cache/canvas/`;
  const arrestImagePath = resolve(__dirname, 'cache/canvas', 'batgiam.png');
  
  if (!existsSync(dirMaterial)) {
    mkdirSync(dirMaterial, { recursive: true });
  }
  
  // Check if background image exists
  if (!existsSync(arrestImagePath)) {
    console.log("[ARREST] Background image not found, attempting to download...");
    
    // Multiple fallback URLs
    const backgroundUrls = [
      "https://i.imgur.com/VQXViKI.png",
      "https://i.imgur.com/ep1gG3r.png",
      "https://i.ibb.co/9ZQX8Kp/arrest-bg.png"
    ];
    
    let downloaded = false;
    
    for (let i = 0; i < backgroundUrls.length && !downloaded; i++) {
      try {
        console.log(`[ARREST] Trying URL ${i + 1}/${backgroundUrls.length}: ${backgroundUrls[i]}`);
        const response = await axios.get(backgroundUrls[i], { 
          responseType: 'stream',
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const writer = fs.createWriteStream(arrestImagePath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        
        console.log("[ARREST] Background image downloaded successfully from:", backgroundUrls[i]);
        downloaded = true;
        
      } catch (error) {
        console.log(`[ARREST] Failed to download from URL ${i + 1}:`, error.message);
        if (i === backgroundUrls.length - 1) {
          console.log("[ARREST] All download attempts failed. Creating fallback background...");
          // Create a simple colored background as fallback
          try {
            const { createCanvas } = require("canvas");
            const canvas = createCanvas(500, 500);
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, 500, 500);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(arrestImagePath, buffer);
            console.log("[ARREST] Fallback background created successfully");
          } catch (fallbackError) {
            console.log("[ARREST] Failed to create fallback background:", fallbackError.message);
          }
        }
      }
    }
  }
};

async function downloadAvatar(userID, outputPath) {
  const axios = require("axios");
  const fs = require("fs-extra");
  
  try {
    const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(outputPath, Buffer.from(response.data));
    return true;
  } catch (error) {
    console.log(`[ARREST] Failed to download avatar for ${userID}:`, error.message);
    return false;
  }
}

async function createArrestImage(userOne, userTwo) {
  const fs = require("fs-extra");
  const path = require("path");
  const { loadImage, createCanvas } = require("canvas");
  
  try {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const backgroundPath = __root + "/batgiam.png";
    const avatarOnePath = __root + `/avatar_${userOne}.png`;
    const avatarTwoPath = __root + `/avatar_${userTwo}.png`;
    const outputPath = __root + `/arrest_${userOne}_${userTwo}_${Date.now()}.png`;

    // Check if background exists
    if (!fs.existsSync(backgroundPath)) {
      throw new Error("Background image not found");
    }

    // Download avatars
    console.log("[ARREST] Downloading avatars...");
    const avatar1Success = await downloadAvatar(userOne, avatarOnePath);
    const avatar2Success = await downloadAvatar(userTwo, avatarTwoPath);

    if (!avatar1Success || !avatar2Success) {
      throw new Error("Failed to download one or both avatars");
    }

    // Load images using Canvas
    console.log("[ARREST] Creating composite image...");
    const backgroundImage = await loadImage(backgroundPath);
    const avatar1Image = await loadImage(avatarOnePath);
    const avatar2Image = await loadImage(avatarTwoPath);

    // Create canvas
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(backgroundImage, 0, 0, 500, 500);

    // Function to draw circular avatar
    function drawCircularAvatar(image, x, y, size) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(image, x, y, size, size);
      ctx.restore();
    }

    // Draw avatars (adjust positions based on your background)
    drawCircularAvatar(avatar1Image, 375, 9, 100);   // Arrester position
    drawCircularAvatar(avatar2Image, 160, 92, 100);  // Arrested position

    // Save the final image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    // Clean up avatar files
    if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
    if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);

    console.log("[ARREST] Image created successfully at:", outputPath);
    return outputPath;

  } catch (error) {
    console.log("[ARREST] Error in createArrestImage:", error.message);
    throw error;
  }
}

module.exports.run = async function ({ event, api, Users }) {
  const fs = require("fs-extra");
  const { threadID, messageID, senderID } = event;

  try {
    // Check if someone is mentioned
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      return api.sendMessage("⚠️ দয়া করে কাউকে ট্যাগ করুন যাকে গ্রেফতার করতে চান!", threadID, messageID);
    }

    // Get mentioned user's name
    const mentionedName = await Users.getNameUser(mention) || event.mentions[mention]?.replace("@", "");

    // Check if owner is tagged
    if (OWNER_UIDS.includes(mention)) {
      return api.sendMessage(
        `😹👑 হালা tui baap re arrest korbi! Boss কে গ্রেফতার করা যায় না!`,
        threadID,
        messageID
      );
    }

    // Send processing message
    const processingMsg = await api.sendMessage(
      "🚔 গ্রেফতারি অভিযান শুরু হয়েছে... অপেক্ষা করুন! ⏳",
      threadID
    );

    console.log(`[ARREST] Creating arrest image for ${mention} by ${senderID}`);

    // Create the arrest image
    const imagePath = await createArrestImage(senderID, mention);

    // Check if image was created successfully
    if (!fs.existsSync(imagePath)) {
      throw new Error("Failed to create arrest image");
    }

    // Unsend processing message
    await api.unsendMessage(processingMsg.messageID);

    // Send the arrest message with image
    return api.sendMessage({
      body: `╭──🚔 𝐀𝐑𝐑𝐄𝐒𝐓 𝐎𝐏𝐄𝐑𝐀𝐓𝐈𝐎𝐍 🚔──╮
│
│ 🔒 ${mentionedName}, তোমাকে গ্রেফতার করা হয়েছে!
│ 
│ 👮‍♂️ অভিযোগ: সাধারণ মানুষের হৃদয় চুরি!
│ 🏛️ আদালত: TOHI-BOT আদালত
│ ⚖️ বিচারক: বট জাস্টিস সিস্টেম
│
│ 🔐 জামিন পেতে তহিদুল boss এর সাথে যোগাযোগ করো!
│
╰────────────────────────╯

🤖 Powered by TOHI-BOT-HUB`,
      mentions: [{
        tag: mentionedName,
        id: mention
      }],
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => {
      // Clean up the image file after sending
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`[ARREST] Cleaned up image file: ${imagePath}`);
        }
      } catch (cleanupError) {
        console.log(`[ARREST] Cleanup error: ${cleanupError.message}`);
      }
    }, messageID);

  } catch (error) {
    console.log(`[ARREST] Command error: ${error.message}`);
    
    // Try to unsend processing message if it exists
    try {
      if (processingMsg && processingMsg.messageID) {
        await api.unsendMessage(processingMsg.messageID);
      }
    } catch (e) {
      // Ignore unsend errors
    }
    
    return api.sendMessage(
      "❌ গ্রেফতার করতে সমস্যা হয়েছে! দয়া করে আবার চেষ্টা করুন।\n\n🔧 সমস্যা: " + error.message,
      threadID,
      messageID
    );
  }
};
