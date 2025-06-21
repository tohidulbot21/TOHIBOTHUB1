module.exports = {
config: {
  name: "spotify",
  version: "0.0.2",
  permission: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "",
  commandCategory: "media",
  usages: "",
    cooldowns: 5,
},

  languages: {
  "vi": {},
      "en": {
          "missing": '[ ! ] Input Song Name.',
          "send": 'sending search result.',
        "error": '❌Error'
      }
  },

run: async function({ api, event, args, getText }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  
  if (!args[0]) return api.sendMessage("❌ Please provide a song name to search for.", event.threadID, event.messageID);
  
  try {
    const text = args.join(" ");
    const processingMsg = await api.sendMessage(`🎵 Searching for "${text}"...`, event.threadID);
    
    // Using alternative API since nayan-api-server might not be available
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(text)}&type=track&limit=1`;
    
    // For now, using a simplified approach with YouTube search
    const ytSearch = require("yt-search");
    const searchResults = await ytSearch(`${text} spotify`);
    
    if (!searchResults || !searchResults.videos.length) {
      api.unsendMessage(processingMsg.messageID);
      return api.sendMessage("❌ No results found for your search.", event.threadID, event.messageID);
    }
    
    const topResult = searchResults.videos[0];
    const ytdl = require("@distube/ytdl-core");
    
    const stream = ytdl(`https://www.youtube.com/watch?v=${topResult.videoId}`, {
      filter: "audioonly",
      quality: "highestaudio"
    });
    
    const filename = `spotify_${Date.now()}.mp3`;
    const filepath = __dirname + `/cache/${filename}`;
    
    stream.pipe(fs.createWriteStream(filepath))
      .on("close", () => {
        try {
          const fileSize = fs.statSync(filepath).size;
          if (fileSize > 52428800) {
            fs.unlinkSync(filepath);
            api.unsendMessage(processingMsg.messageID);
            return api.sendMessage("❌ File too large to send (>50MB)", event.threadID, event.messageID);
          }
          
          const msg = `🎵 ${topResult.title}\n\n⇆ㅤ ㅤ◁ㅤ ❚❚ ㅤ▷ ㅤㅤ↻`;
          
          api.sendMessage({
            body: msg,
            attachment: fs.createReadStream(filepath)
          }, event.threadID, () => {
            fs.unlinkSync(filepath);
            api.unsendMessage(processingMsg.messageID);
          }, event.messageID);
          
        } catch (error) {
          api.unsendMessage(processingMsg.messageID);
          api.sendMessage(`❌ Error processing file: ${error.message}`, event.threadID, event.messageID);
        }
      })
      .on("error", (error) => {
        api.unsendMessage(processingMsg.messageID);
        api.sendMessage(`❌ Download error: ${error.message}`, event.threadID, event.messageID);
      });
      
  } catch (error) {
    console.error("Spotify command error:", error);
    api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
  }
}
}
