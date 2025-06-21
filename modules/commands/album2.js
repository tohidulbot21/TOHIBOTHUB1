
module.exports.config = {
  name: "album2",
  version: "2.0.0",
  permission: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "Random video collection with multiple categories",
  commandCategory: "media",
  usages: "video2 [category_number]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ event, api, args }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  
  if (!args[0]) {
    return api.sendMessage(
      "╔════「 🎬 𝐕𝐈𝐃𝐄𝐎 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐄𝐒 🎬 」════╗\n" +
      "║                                                                    ║\n" +
      "║  𝟙. 💞 𝐋𝐎𝐕𝐄 𝐕𝐈𝐃𝐄𝐎                                    ║\n" +
      "║  𝟚. 💕 𝐂𝐎𝐔𝐏𝐋𝐄 𝐕𝐈𝐃𝐄𝐎                                ║\n" +
      "║  𝟛. 📽 𝐒𝐇𝐎𝐑𝐓 𝐕𝐈𝐃𝐄𝐎                                ║\n" +
      "║  𝟜. 😔 𝐒𝐀𝐃 𝐕𝐈𝐃𝐄𝐎                                    ║\n" +
      "║  𝟝. 📝 𝐒𝐓𝐀𝐓𝐔𝐒 𝐕𝐈𝐃𝐄𝐎                              ║\n" +
      "║  𝟞. 🎭 𝐒𝐇𝐀𝐈𝐑𝐈 𝐕𝐈𝐃𝐄𝐎                              ║\n" +
      "║  𝟟. 😻 𝐁𝐀𝐁𝐘 𝐕𝐈𝐃𝐄𝐎                                  ║\n" +
      "║  𝟠. 🌸 𝐀𝐍𝐈𝐌𝐄 𝐕𝐈𝐃𝐄𝐎                                ║\n" +
      "║  𝟡. ❄ 𝐇𝐔𝐌𝐀𝐈𝐘𝐔𝐍 𝐅𝐎𝐑𝐈𝐃 𝐒𝐈𝐑              ║\n" +
      "║  𝟙𝟘. 🤲 𝐈𝐒𝐋𝐀𝐌𝐈𝐊 𝐕𝐈𝐃𝐄𝐎                          ║\n" +
      "║                                                                    ║\n" +
      "║ ═══「 🔞 𝟏𝟖+ 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐄𝐒 🔞 」═══  ║\n" +
      "║                                                                    ║\n" +
      "║  𝟙𝟙. 🥵 𝐇𝐎𝐑𝐍𝐘 𝐕𝐈𝐃𝐄𝐎                              ║\n" +
      "║  𝟙𝟚. 🔞 𝐇𝐎𝐓 𝐕𝐈𝐃𝐄𝐎                                  ║\n" +
      "║  𝟙𝟛. 💃 𝐈𝐓𝐄𝐌 𝐕𝐈𝐃𝐄𝐎                                ║\n" +
      "║                                                                    ║\n" +
      "╚════════════════════════════════════════════════════╝\n\n" +
      "💡 𝐔𝐬𝐚𝐠𝐞: Reply with a number (1-13) or use /video2 [number]",
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "create"
        });
      },
      event.messageID
    );
  }
  
  // Handle direct number input
  const choice = parseInt(args[0]);
  if (choice && choice >= 1 && choice <= 13) {
    return await processVideoRequest(api, event, choice);
  } else {
    return api.sendMessage("❌ Invalid choice. Please choose a number between 1-13.", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  if (handleReply.type === "create") {
    const choice = parseInt(event.body);
    
    if (!choice || isNaN(choice) || choice < 1 || choice > 13) {
      return api.sendMessage("❌ Invalid choice. Please reply with a number between 1-13.", event.threadID, event.messageID);
    }
    
    return await processVideoRequest(api, event, choice);
  }
};

async function processVideoRequest(api, event, choice) {
  const fs = require("fs-extra");
  const axios = require("axios");
  
  try {
    // Send loading message
    const loadingMsg = await api.sendMessage("⏳ Processing your request... Please wait!", event.threadID);
    
    const { videoUrl, caption, count } = await getVideoByChoice(choice);
    
    if (!videoUrl) {
      api.unsendMessage(loadingMsg.messageID);
      return api.sendMessage("❌ No video found for this category. Please try another option.", event.threadID, event.messageID);
    }
    
    // Download video
    const videoData = (await axios.get(videoUrl, { 
      responseType: "arraybuffer",
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })).data;
    
    const fileName = `video2_${Date.now()}.mp4`;
    const filePath = __dirname + `/cache/${fileName}`;
    
    fs.writeFileSync(filePath, Buffer.from(videoData));
    
    // Check file size (25MB limit)
    const fileSize = fs.statSync(filePath).size;
    if (fileSize > 26214400) {
      fs.unlinkSync(filePath);
      api.unsendMessage(loadingMsg.messageID);
      return api.sendMessage("❌ Video file is too large (>25MB). Please try another video.", event.threadID, event.messageID);
    }
    
    // Unsend loading message
    api.unsendMessage(loadingMsg.messageID);
    
    return api.sendMessage({
      body: `╔═══════✨ 𝐕𝐈𝐃𝐄𝐎 𝐃𝐄𝐋𝐈𝐕𝐄𝐑𝐄𝐃 ✨═══════╗\n` +
            `║ ${caption}\n` +
            `║\n` +
            `║ 📊 𝐓𝐨𝐭𝐚𝐥 𝐕𝐢𝐝𝐞𝐨𝐬: ${count}\n` +
            `║ 📱 𝐒𝐢𝐳𝐞: ${(fileSize / (1024 * 1024)).toFixed(2)} MB\n` +
            `║ 🎬 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${getCategoryName(choice)}\n` +
            `╚═══════💫 TOHI-BOT-HUB 💫═══════╝`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    
  } catch (error) {
    console.error("Video2 error:", error);
    return api.sendMessage(
      `❌ Failed to fetch video. Error: ${error.message}\n\n` +
      `💡 This might be due to:\n` +
      `• Network connectivity issues\n` +
      `• API service temporarily unavailable\n` +
      `• Invalid video URL\n\n` +
      `Please try again later or choose a different category.`, 
      event.threadID, 
      event.messageID
    );
  }
}

async function getVideoByChoice(choice) {
  const axios = require("axios");
  
  try {
    // Primary API source
    const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
    const baseApi = apis.data.api;
    
    const options = {
      "1": "/video/love",
      "2": "/video/cpl", 
      "3": "/video/shortvideo",
      "4": "/video/sadvideo",
      "5": "/video/status",
      "6": "/video/shairi",
      "7": "/video/baby",
      "8": "/video/anime",
      "9": "/video/humaiyun",
      "10": "/video/islam",
      "11": "/video/horny",
      "12": "/video/hot",
      "13": "/video/item"
    };
    
    const endpoint = `${baseApi}${options[choice]}`;
    const response = await axios.get(endpoint, { timeout: 15000 });
    
    if (response.data && response.data.data) {
      return {
        videoUrl: response.data.data,
        caption: response.data.nayan || getCategoryName(choice),
        count: response.data.count || "Unknown"
      };
    } else {
      throw new Error("Invalid API response");
    }
    
  } catch (error) {
    console.error("Primary API failed:", error.message);
    
    // Fallback to alternative sources
    try {
      const fallbackApis = [
        "https://raw.githubusercontent.com/quyenkaneki/data/main/video.json",
        "https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/video.json"
      ];
      
      for (const fallbackApi of fallbackApis) {
        try {
          const fallbackResponse = await axios.get(fallbackApi, { timeout: 10000 });
          const videos = fallbackResponse.data.videos || fallbackResponse.data;
          
          if (videos && videos.length > 0) {
            const randomVideo = videos[Math.floor(Math.random() * videos.length)];
            return {
              videoUrl: randomVideo.url || randomVideo,
              caption: `Random ${getCategoryName(choice)} Video`,
              count: videos.length.toString()
            };
          }
        } catch (fallbackError) {
          console.error(`Fallback API failed: ${fallbackApi}`, fallbackError.message);
          continue;
        }
      }
      
      // Final fallback - static demo videos
      return getFallbackVideo(choice);
      
    } catch (fallbackError) {
      console.error("All fallback APIs failed:", fallbackError.message);
      return getFallbackVideo(choice);
    }
  }
}

function getFallbackVideo(choice) {
  // Static fallback videos for demonstration
  const fallbackVideos = {
    "1": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
    "2": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4",
    "3": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
    "4": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4",
    "5": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
    "6": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4",
    "7": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
    "8": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4",
    "9": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
    "10": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4",
    "11": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
    "12": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4",
    "13": "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4"
  };
  
  return {
    videoUrl: fallbackVideos[choice] || fallbackVideos["1"],
    caption: `Demo ${getCategoryName(choice)} Video`,
    count: "1"
  };
}

function getCategoryName(choice) {
  const categories = {
    1: "Love Video",
    2: "Couple Video",
    3: "Short Video", 
    4: "Sad Video",
    5: "Status Video",
    6: "Shairi Video",
    7: "Baby Video",
    8: "Anime Video",
    9: "Humaiyun Forid Sir",
    10: "Islamic Video",
    11: "Horny Video",
    12: "Hot Video",
    13: "Item Video"
  };
  
  return categories[choice] || "Unknown Category";
}
