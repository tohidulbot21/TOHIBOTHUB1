
const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "lyrics",
    version: "1.0.1",
    credits: "TOHI-BOT-HUB",
    cooldowns: 5,
    hasPermssion: 0,
    usePrefix: true,
    prefix: true,
    description: "Get song lyrics with their Images",
    commandCategory: "song",
    category: "song",
    usages: "lyrics [song name]"
  },

  run: async ({ api, event, args }) => {
    try {
      const Songs = args.join(' ');
      if (!Songs) {
        return api.sendMessage("Please provide a song name!\nExample: /lyrics Shape of You", event.threadID, event.messageID);
      }

      // Send processing message
      const processingMsg = await api.sendMessage("🎵 Searching for lyrics... Please wait!", event.threadID);

      // Multiple API endpoints for lyrics
      const lyricsAPIs = [
        // Primary API
        `${await baseApiUrl()}/lyrics2?songName=${encodeURIComponent(Songs)}`,
        // Fallback APIs
        `${await baseApiUrl()}/lyrics?song=${encodeURIComponent(Songs)}`,
        `https://some-random-api.ml/lyrics?title=${encodeURIComponent(Songs)}`,
        `https://api.popcat.xyz/lyrics?song=${encodeURIComponent(Songs)}`,
        `https://lyrist.vercel.app/api/${encodeURIComponent(Songs)}`
      ];

      let lyricsData = null;
      let apiUsed = 0;

      // Try each API until one works
      for (let i = 0; i < lyricsAPIs.length; i++) {
        try {
          console.log(`[LYRICS] Trying API ${i + 1}: ${lyricsAPIs[i]}`);
          
          const response = await axios.get(lyricsAPIs[i], {
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (response.data) {
            // Handle different API response formats
            if (response.data.title && response.data.artist && response.data.lyrics) {
              // Format 1: Main API format
              lyricsData = {
                title: response.data.title,
                artist: response.data.artist,
                lyrics: response.data.lyrics,
                image: response.data.image || null
              };
              apiUsed = i + 1;
              break;
            } else if (response.data.title && response.data.author && response.data.lyrics) {
              // Format 2: Alternative format
              lyricsData = {
                title: response.data.title,
                artist: response.data.author,
                lyrics: response.data.lyrics,
                image: response.data.thumbnail || response.data.image || null
              };
              apiUsed = i + 1;
              break;
            } else if (response.data.song && response.data.artist && response.data.lyrics) {
              // Format 3: Another format
              lyricsData = {
                title: response.data.song,
                artist: response.data.artist,
                lyrics: response.data.lyrics,
                image: response.data.image || null
              };
              apiUsed = i + 1;
              break;
            }
          }
        } catch (apiError) {
          console.log(`[LYRICS] API ${i + 1} failed:`, apiError.message);
          continue;
        }
      }

      await api.unsendMessage(processingMsg.messageID);

      if (!lyricsData) {
        return api.sendMessage(
          "❌ **Lyrics Not Found**\n\n" +
          "• Song not found in any database\n" +
          "• All lyrics APIs are currently unavailable\n" +
          "• Try a different song title or artist name\n\n" +
          "💡 **Tips:**\n" +
          "• Use full song title\n" +
          "• Include artist name: `/lyrics Shape of You Ed Sheeran`\n" +
          "• Check spelling\n\n" +
          "🚩 **Made by TOHI-BOT-HUB**",
          event.threadID, event.messageID
        );
      }

      // Clean and format lyrics
      let cleanLyrics = lyricsData.lyrics
        .replace(/\[.*?\]/g, '') // Remove [Verse], [Chorus] etc.
        .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
        .trim();

      // Truncate if too long
      if (cleanLyrics.length > 3000) {
        cleanLyrics = cleanLyrics.substring(0, 3000) + "...\n\n[Lyrics truncated - too long]";
      }

      const songMessage = { 
        body: `🎵 **LYRICS FOUND** 🎵\n\n` +
              `❏♡ **Song Title:** ${lyricsData.title}\n\n` +
              `❏♡ **Artist:** ${lyricsData.artist}\n\n` +
              `❏♡ **Song Lyrics:**\n\n${cleanLyrics}\n\n` +
              `🔗 **API Used:** ${apiUsed}/${lyricsAPIs.length}\n` +
              `🚩 **Made by TOHI-BOT-HUB**`
      };
      
      // Add image if available
      if (lyricsData.image) {
        try {
          const imageResponse = await axios.get(lyricsData.image, { 
            responseType: 'stream',
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          songMessage.attachment = imageResponse.data;
        } catch (imageError) {
          console.log("[LYRICS] Image download failed:", imageError.message);
          // Continue without image
        }
      }

      return api.sendMessage(songMessage, event.threadID, event.messageID);

    } catch (error) {
      console.error("[LYRICS] Main error:", error.message);
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
  }
};
