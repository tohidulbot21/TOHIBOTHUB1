module.exports.config = {
  name: "love2",
  version: "1.0.0",
  permission: 0,
  credits: "TOHI-BOT-HUB",
  description: "",
  usePrefix: true,
  commandCategory: "Love",
  usages: "love2 @",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "canvas": ""
  }
};

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
// Canvas removed to fix libuuid error

module.exports.onLoad = async () => {
  const cachePath = path.join(__dirname, "cache");
  const imgPath = path.join(cachePath, "frtwb.png");

  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

  if (!fs.existsSync(imgPath)) {
    const imgUrl = "https://i.postimg.cc/59BcbrFV/lov2.jpg";
    const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(res.data));
  }
};

async function makeImage({ one, two }) {
  // Canvas functionality disabled due to system requirements
  return null;
}

module.exports.run = async function ({ event, api, args }) {
  const { threadID, messageID, senderID, mentions } = event;
  const mentionId = Object.keys(mentions)[0];
  const mentionTag = mentions[mentionId]?.replace('@', '') || null;

  if (!mentionId) {
    return api.sendMessage('Please tag 1 person.', threadID, messageID);
  }

  try {
    // Send text-only message due to system limitations
    api.sendMessage({
      body: `🫣 @${mentionTag} love you so much 🤗🥀\n\n📝 Note: Image generation temporarily unavailable`,
      mentions: [{ tag: mentionTag, id: mentionId }]
    }, threadID, messageID);

  } catch (e) {
    console.error("Command error:", e);
    api.sendMessage("Command execute korte problem hocche! " + e.message, threadID, messageID);
  }
};
