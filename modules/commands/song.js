const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
 config: {
 name: "song",
 version: "1.0.3",
 usePrefix: true,
 hasPermssion: 0,
 credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 description: "Download YouTube song from keyword search and link",
 commandCategory: "Media",
 usages: "[songName] [type]",
 cooldowns: 5,
 dependencies: {
 "node-fetch": "",
 "yt-search": "",
 },
 },

 handleReply: async function ({ api, event, handleReply }) {
   try {
     if (!handleReply || !handleReply.results) {
       return api.sendMessage("❌ Invalid selection data.", event.threadID, event.messageID);
     }

     const selection = parseInt(event.body.trim());
     if (isNaN(selection) || selection < 1 || selection > handleReply.results.length) {
       return api.sendMessage(`❌ Invalid selection! Please reply with a number between 1 and ${handleReply.results.length}`, event.threadID, event.messageID);
     }

     const selectedSong = handleReply.results[selection - 1];
     const processingMsg = await api.sendMessage("🎵 Processing your request...", event.threadID);

     const apiKey = "priyansh-here";
     const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${selectedSong.videoId}&type=audio&apikey=${apiKey}`;

     const downloadResponse = await axios.get(apiUrl);
     const downloadUrl = downloadResponse.data.downloadUrl;

     const safeTitle = selectedSong.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
     const filename = `${safeTitle}.mp3`;
     const downloadPath = path.join(__dirname, "cache", filename);

     if (!fs.existsSync(path.dirname(downloadPath))) {
       fs.mkdirSync(path.dirname(downloadPath), { recursive: true });
     }

     const response = await axios({
       url: downloadUrl,
       method: "GET",
       responseType: "stream",
     });

     const fileStream = fs.createWriteStream(downloadPath);
     response.data.pipe(fileStream);

     await new Promise((resolve, reject) => {
       fileStream.on("finish", resolve);
       fileStream.on("error", reject);
     });

     await api.sendMessage({
       attachment: fs.createReadStream(downloadPath),
       body: `🎵 ${selectedSong.title}\n\nHere is your audio 🎧`,
     }, event.threadID, () => {
       fs.unlinkSync(downloadPath);
       api.unsendMessage(processingMsg.messageID);
     }, event.messageID);

     return api.unsendMessage(handleReply.messageID);
   } catch (error) {
     console.error(`Failed to download song: ${error.message}`);
     return api.sendMessage(`❌ Failed to download song: ${error.message}`, event.threadID, event.messageID);
   }
 },

 run: async function ({ api, event, args }) {
 if (!args.length) {
   return api.sendMessage("❌ Please provide a song name to search for.", event.threadID, event.messageID);
 }

 let songName, type;

 if (
 args.length > 1 &&
 (args[args.length - 1] === "audio" || args[args.length - 1] === "video")
 ) {
 type = args.pop();
 songName = args.join(" ");
 } else {
 songName = args.join(" ");
 type = "audio";
 }

 try {
 const searchResults = await ytSearch(songName);
 if (!searchResults || !searchResults.videos.length) {
 throw new Error("No results found for your search query.");
 }

 // If only one result or direct download requested
 if (searchResults.videos.length === 1 || args.includes("--direct")) {
   const processingMessage = await api.sendMessage(
     "✅ Processing your request. Please wait...",
     event.threadID,
     null,
     event.messageID
   );

   const topResult = searchResults.videos[0];
 const videoId = topResult.videoId;

   const apiKey = "priyansh-here";
   const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

   api.setMessageReaction("⌛", event.messageID, () => {}, true);

   const downloadResponse = await axios.get(apiUrl);
   const downloadUrl = downloadResponse.data.downloadUrl;

   const safeTitle = topResult.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
   const filename = `${safeTitle}.${type === "audio" ? "mp3" : "mp4"}`;
   const downloadPath = path.join(__dirname, "cache", filename);

   if (!fs.existsSync(path.dirname(downloadPath))) {
   fs.mkdirSync(path.dirname(downloadPath), { recursive: true });
   }

   const response = await axios({
   url: downloadUrl,
   method: "GET",
   responseType: "stream",
   });

   const fileStream = fs.createWriteStream(downloadPath);
   response.data.pipe(fileStream);

   await new Promise((resolve, reject) => {
   fileStream.on("finish", resolve);
   fileStream.on("error", reject);
   });

   api.setMessageReaction("✅", event.messageID, () => {}, true);

   await api.sendMessage(
   {
   attachment: fs.createReadStream(downloadPath),
   body: `🖤 Title: ${topResult.title}\n\n Here is your ${
   type === "audio" ? "audio" : "video"
   } 🎧:`,
   },
   event.threadID,
   () => {
   fs.unlinkSync(downloadPath);
   api.unsendMessage(processingMessage.messageID);
   },
   event.messageID
   );
 } else {
   // Show search results for selection
   let msg = `🔍 Found ${searchResults.videos.length} results for "${songName}":\n\n`;
   const results = searchResults.videos.slice(0, 5);
   
   results.forEach((video, index) => {
     msg += `${index + 1}. ${video.title}\n`;
     msg += `   Duration: ${video.duration.timestamp}\n`;
     msg += `   Channel: ${video.author.name}\n\n`;
   });
   
   msg += `Reply with a number (1-${results.length}) to download your choice.`;
   
   return api.sendMessage(msg, event.threadID, (error, info) => {
     if (!error) {
       global.client.handleReply.push({
         name: this.config.name,
         messageID: info.messageID,
         author: event.senderID,
         threadID: event.threadID,
         results: results,
         type: type
       });
     }
   }, event.messageID);
 }
 } catch (error) {
 console.error(`Failed to download and send song: ${error.message}`);
 api.sendMessage(
 `Failed to download song: ${error.message}`,
 event.threadID,
 event.messageID
 );
 }
 },
};