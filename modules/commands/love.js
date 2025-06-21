
/**
* @author ProCoderMew
* @warn Do not edit code or edit credits
*/

module.exports.config = {
  name: "love", 
  version: "1.0.0", 
  permission: 0,
  credits: "TOHI-BOT-HUB",
  description: "",
  usePrefix: true,
  commandCategory: "Love", 
  usages: "love @", 
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
  const cachePath = __dirname + "/cache/";
  const imgPath = path.resolve(__dirname, "cache", "ewhd.png");
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
  if (!fs.existsSync(imgPath)) {
    const bg = "https://i.postimg.cc/05tPS3cq/1eb9276ff9b9a420f6fd7de70a3f94b2.jpg";
    const res = await axios.get(bg, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(res.data, "utf-8"));
  }
};

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
  return null;
}

module.exports.run = async function({ event, api, args }) {
  const fs = require("fs-extra");
  const { threadID, messageID, senderID, mentions } = event;
  var mentionId = Object.keys(mentions)[0];
  let mentionTag = mentionId ? mentions[mentionId].replace('@', '') : null;
  if (!mentionId) {
    return api.sendMessage("Please tag 1 person", threadID, messageID);
  } else {
    var id1 = senderID, id2 = mentionId;
    // Send text-only message due to system limitations
    api.sendMessage(
      {
        body: `👉 @${mentionTag} love you so much🥰\n\n📝 Note: Image generation temporarily unavailable`,
        mentions: [{ tag: mentionTag, id: mentionId }]
      },
      threadID,
      messageID
    );
  }
};
