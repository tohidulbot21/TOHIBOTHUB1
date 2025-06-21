const path = require('path');
const fs = require('fs');

// Add Canvas imports with fallback handling
let createCanvas, loadImage;
try {
  const Canvas = require('canvas');
  createCanvas = Canvas.createCanvas;
  loadImage = Canvas.loadImage;
} catch (error) {
  console.log('Canvas not available, image generation disabled');
  createCanvas = null;
  loadImage = null;
}

const cacheDir = path.join(__dirname, 'cache');
const rankpng = path.join(__dirname, 'cache', 'rankup');

if (!fs.existsSync(rankpng)) {
    fs.mkdirSync(rankpng, { recursive: true });
}

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

module.exports.config = {
  name: "rankup",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "TOHI-BOT-HUB",
  description: "Announce rankup for each group, user",
  usePrefix: true,
  commandCategory: "Edit-IMG",
  dependencies: {
    "fs-extra": ""
  },
  cooldowns: 2,
};

module.exports.handleEvent = async function({
  api, event, Currencies, getText, Threads }) {
  var { threadID, senderID } = event;
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/rankup/rankup.png";
  let pathAvt1 = __dirname + "/cache/Avtmot.png";
  var id1 = event.senderID;

  threadID = String(threadID);
  senderID = String(senderID);

  const thread = global.data.threadData.get(threadID) || {};

  let userData;
  try {
    userData = await Currencies.getData(senderID);
  } catch (error) {
    console.log(`Error getting currency data for ${senderID}: ${error.message}`);
    return;
  }

  if (!userData) {
    console.log(`No user data found for ${senderID}`);
    return;
  }

  let exp = userData.exp || 0;
  exp = exp += 1;

  if (isNaN(exp)) return;

  if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
    await Currencies.setData(senderID, {
      exp
    });
    return;
  };

  const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
  const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

  if (level > curLevel && level != 1) {
    let name;
  try {
    const getName = await api.getUserInfo(id1);
    name = getName[id1]?.name || `User-${id1.slice(-6)}`;
  } catch (error) {
    name = `User-${id1.slice(-6)}`;
  }
    // Fallback for getText function
    const getTextSafe = (key) => {
      if (typeof getText === 'function') {
        return getText(key);
      }
      // Fallback messages
      const fallbackMessages = {
        "levelup": "Congratulations {name}, being talkative helped you level up to level {level}!"
      };
      return fallbackMessages[key] || `Message for ${key}`;
    };

    var messsage = (typeof thread.customRankup == "undefined") ? msg = getTextSafe("levelup") : msg = thread.customRankup;

    messsage = messsage
      .replace(/\{name}/g, name)
      .replace(/\{level}/g, level);

    var background = [
      "https://i.ibb.co/7xrf2Px8/rankup.png",
      "https://i.ibb.co/JFFDjqFk/rankup.png",
      "https://i.ibb.co/jZHb2st9/rankup.png"
    ];
    var rd = background[Math.floor(Math.random() * background.length)];
    let getAvtmot = (
      await axios.get(
        `https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
        responseType: "arraybuffer"
      }
      )
    )
      .data;
    fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

    let getbackground = (
      await axios.get(`${rd}`, {
        responseType: "arraybuffer"
        ,
      })
    )
      .data;
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    // Check if Canvas is available
    if (!loadImage || !createCanvas) {
      // Send text-only message if Canvas is not available
      fs.removeSync(pathAvt1);
      fs.removeSync(pathImg);
      return api.sendMessage({
        body: messsage + "\n\n📝 Note: Image generation temporarily unavailable",
        mentions: [{
          tag: name,
          id: senderID
        }]
      }, event.threadID);
    }

    try {
      let baseImage = await loadImage(pathImg);
      let baseAvt1 = await loadImage(pathAvt1);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.rotate(-25 * Math.PI / 180);
      ctx.drawImage(baseAvt1, 27.3, 103, 108, 108);
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      fs.removeSync(pathAvt1);
      api.sendMessage({
        body: messsage,
        mentions: [{
          tag: name,
          id: senderID
        }],
        attachment: fs.createReadStream(pathImg)
      }, event.threadID, () => fs.unlinkSync(pathImg));
    } catch (canvasError) {
      // Fallback to text-only if Canvas operations fail
      console.log(`Canvas error in rankup: ${canvasError.message}`);
      fs.removeSync(pathAvt1);
      fs.removeSync(pathImg);
      return api.sendMessage({
        body: messsage + "\n\n📝 Note: Image generation failed, showing text only",
        mentions: [{
          tag: name,
          id: senderID
        }]
      }, event.threadID);
    }

  }

  await Currencies.setData(senderID, {
    exp
  });
  return;
}

module.exports.languages = {
  "en": {
    "on": "on",
    "off": "off",
    "successText": "success notification rankup!",
    "levelup": "Congratulations {name}, being talkative helped you level up to level {level}!",
  }
}

module.exports.run = async function({ api, event, Threads, getText }) {
  const {
    threadID
    , messageID
  } = event;
  let data = (await Threads.getData(threadID))
    .data;

  if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
  else data["rankup"] = false;

  await Threads.setData(threadID, {
    data
  });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
}