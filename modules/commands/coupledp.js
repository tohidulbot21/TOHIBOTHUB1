const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "coupledp",
    aliases: ["cpldp","couplepp","cplpp"],
    version: "1.0",
    usePrefix: true,
    author: "Made by Tohidul",
    commandCategory: "image",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get a couple display picture"
    },
    longDescription: {
      en: "Fetches a cute couple DP (display picture) for you."
    },
    category: "image",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      // Ensure tmp directory exists
      const tmpDir = path.join(__dirname, "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      // Fetch couple dp data
      const { data } = await axios.get(
        "https://tanjiro-api.onrender.com/cdp?api_key=tanjiro"
      );
      // Download images
      const maleImg = await axios.get(data.male, { responseType: "arraybuffer" });
      fs.writeFileSync(path.join(tmpDir, "img1.png"), Buffer.from(maleImg.data, "binary"));
      const femaleImg = await axios.get(data.female, { responseType: "arraybuffer" });
      fs.writeFileSync(path.join(tmpDir, "img2.png"), Buffer.from(femaleImg.data, "binary"));

      // Send images
      const msg = "Here is your couple DP 💑";
      const allImages = [
        fs.createReadStream(path.join(tmpDir, "img1.png")),
        fs.createReadStream(path.join(tmpDir, "img2.png"))
      ];

      api.sendMessage(
        { body: msg, attachment: allImages },
        event.threadID,
        () => {
          // Clean up files after sending
          fs.unlinkSync(path.join(tmpDir, "img1.png"));
          fs.unlinkSync(path.join(tmpDir, "img2.png"));
        },
        event.messageID
      );
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Error: Unable to fetch couple DP at this time. Please try again later.", event.threadID, event.messageID);
    }
  }
};