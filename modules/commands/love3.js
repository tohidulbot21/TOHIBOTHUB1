
/**
* @author Mohammad Nayan
*/

module.exports.config = {
  name: "love3", 
  version: "1.0.0", 
  permission: 0,
  credits: "TOHI-BOT-HUB",
  description: "example",
  usePrefix: true,
  commandCategory: "Love", 
  usages: "love3 @", 
  cooldowns: 5,
  dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const cachePath = __dirname + "/cache/";
  const imgPath = resolve(__dirname, "cache", "lpwft.png");
  
  if (!existsSync(cachePath + "")) mkdirSync(cachePath, { recursive: true });
  if (!existsSync(imgPath)) await downloadFile("https://drive.google.com/uc?id=1yf-3v0oFQAKzqW0gPMF7sQeQbuIZpIKm", imgPath);
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const Jimp = global.nodemodule["jimp"];
  const cachePath = path.resolve(__dirname, "cache");

  let backgroundImg = await Jimp.read(cachePath + "/lpwft.png");
  let outputPath = cachePath + `/lpwft_${one}_${two}.png`;
  let avatarOnePath = cachePath + `/avt_${one}.png`;
  let avatarTwoPath = cachePath + `/avt_${two}.png`;
  
  let avatarOneData = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneData, "utf-8"));
  
  let avatarTwoData = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoData, "utf-8"));
  
  let circleOne = await Jimp.read(await circle(avatarOnePath));
  let circleTwo = await Jimp.read(await circle(avatarTwoPath));
  
  backgroundImg.resize(1270, 720).composite(circleOne.resize(280, 280), 175, 220).composite(circleTwo.resize(280, 280), 833, 220);
  
  let buffer = await backgroundImg.getBufferAsync("image/png");
  fs.writeFileSync(outputPath, buffer);
  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);
  
  return outputPath;
}

async function circle(image) {
  const Jimp = require("jimp");
  image = await Jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function({ event, api, args }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  
  var mentionId = Object.keys(event.mentions)[0];
  let mentionName = event.mentions[mentionId]?.replace("@", "");
  
  if (!mentionId) return api.sendMessage("Please tag 1 person", threadID, messageID);
  else {
    var userOne = senderID;
    var userTwo = mentionId;
    
    return makeImage({ one: userOne, two: userTwo }).then(imagePath => 
      api.sendMessage({
        body: "👉" + mentionName + " love you so much🥰",
        mentions: [{ tag: mentionName, id: mentionId }],
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => fs.unlinkSync(imagePath), messageID)
    );
  }
};
