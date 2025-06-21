const request = require("request");
const fs = require("fs");

module.exports = {
  config: {
    name: "rndm",
    version: "0.0.2",
    permission: 0,
    usePrefix: true,
    credits: "TOHI-BOT-HUB",
    description: "rndm video",
    commandCategory: "media",
    usages: "name",
    cooldowns: 5,
  },

  languages: {
    vi: {},
    en: {
      missing: `[ ! ] Input Name.\nEx: ${global.config.PREFIX}rndm nayan`
    }
  },

  run: async function ({ api, event, args }) {
    const axios = require("axios");
    const nameParam = args.join(" ");
    if (!args[0]) return api.sendMessage(`[ ! ] Input Name.\nEx: ${global.config.PREFIX}rndm nayan`, event.threadID, event.messageID);

    try {
      const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
      const n = apis.data.api;
      const res = await axios.get(`${n}/random?name=${encodeURIComponent(nameParam)}`);

      // Check if response has the expected structure
      if (!res.data || !res.data.data) {
        return api.sendMessage("❌ No video data found. Please try again later.", event.threadID, event.messageID);
      }

      const videoUrl = res.data.data.url;
      const name = res.data.data.name || "Unknown";
      const cp = res.data.data.cp || "No caption available";
      const ln = res.data.data.length || "0";

      if (!videoUrl) {
        return api.sendMessage("❌ Video URL not found. Please try again later.", event.threadID, event.messageID);
      }

      const filePath = __dirname + "/cache/video.mp4";

      const file = fs.createWriteStream(filePath);
      request(videoUrl)
        .pipe(file)
        .on("close", () => {
          return api.sendMessage({
            body: `${cp}\n\n𝐓𝐨𝐭𝐚𝐥 𝐕𝐢𝐝𝐞𝐨𝐬: [${ln}]\n𝐀𝐝𝐝𝐞𝐝 𝐓𝐡𝐢𝐬 𝐕𝐢𝐝𝐞𝐨 𝐓𝐨 𝐓𝐡𝐞 𝐀𝐩𝐢 𝐁𝐲 [${name}]`,
            attachment: fs.createReadStream(filePath)
          }, event.threadID, event.messageID);
        })
        .on("error", (error) => {
          console.error("Download error:", error);
          return api.sendMessage("❌ Failed to download video. Please try again later.", event.threadID, event.messageID);
        });

    } catch (err) {
      console.error(err);
      return api.sendMessage("Something went wrong. Please try again later.", event.threadID, event.messageID);
    }
  }
};
