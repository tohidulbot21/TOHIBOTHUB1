module.exports.config = {
  name: "marriedv2",
  version: "3.1.1",
  hasPermssion: 0,
  usePrefix: true,
  credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
  description: "married",
  commandCategory: "img",
  usages: "[@mention]",
  cooldowns: 5,
  dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
  }
};

module.exports.onLoad = async() => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache/canvas', 'marriedv02.png');
  if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.ibb.co/mc9KNm1/1619885987-21-pibig-info-p-anime-romantika-svadba-anime-krasivo-24.jpg", path);
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const rateLimitHandler = require("../../utils/rateLimitHandler");
  const __root = path.resolve(__dirname, "cache", "canvas");

  try {
    let batgiam_img = await jimp.read(__root + "/marriedv02.png");
    let pathImg = __root + `/batman${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;

    // Download avatars with rate limiting
    const avatarOneResult = await rateLimitHandler.downloadWithRetry(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      avatarOne,
      axios,
      fs
    );

    const avatarTwoResult = await rateLimitHandler.downloadWithRetry(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      avatarTwo,
      axios,
      fs
    );

    if (!avatarOneResult || !avatarTwoResult) {
      console.log("Failed to download avatars for married command");
      return null;
    }

    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    batgiam_img.composite(circleOne.resize(100, 100), 55, 48).composite(circleTwo.resize(100, 100), 190, 40);

    let raw = await batgiam_img.getBufferAsync("image/png");

    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
  } catch (error) {
    console.log("Error in married makeImage:", error.message);
    return null;
  }
}
async function circle(image) {
  const Jimp = require("jimp");
  image = await Jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");ferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {    
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);
  if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);
  else {
      const one = senderID, two = mention[0];
      try {
        const imagePath = await makeImage({ one, two });
        if (!imagePath) {
          return api.sendMessage("❌ Sorry, I couldn't create the married image right now. Please try again later.", threadID, messageID);
        }
        return api.sendMessage({ body: "", attachment: fs.createReadStream(imagePath) }, threadID, () => {
          try {
            fs.unlinkSync(imagePath);
          } catch (e) {
            console.log("Error cleaning up married image file:", e.message);
          }
        }, messageID);
      } catch (error) {
        console.log("Error in married command:", error.message);
        return api.sendMessage("❌ An error occurred while creating the married image.", threadID, messageID);
      }
  }
    }
