
module.exports.config = {
  name: "cover",
  version: "1.0.1",
  hasPermssion: 0,
  usePrefix: true,
  credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
  description: "Create an interesting banner image",
  commandCategory: "Create a photo",
  usages: "cover [text1 - text2]",
  cooldowns: 10,
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": "",
  },
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ api, event, args, Users }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + `/cache/${senderID}.png`;
  let pathAva = __dirname + `/cache/avtuser.png`;
  let text = args.join(" ");
  
  if (!text) return api.sendMessage('💢Please enter the correct format [text1 - text2] ', event.threadID, event.messageID);
  
  const text1 = text.substr(0, text.indexOf(' - ')); 
  if (!text1) return api.sendMessage('💢Please enter the correct format [text1 - text2] ', event.threadID, event.messageID);
  
  const text2 = text.split(" - ").pop();
  if (!text2) return api.sendMessage('💢Please enter the correct format [text1 - text2] ', event.threadID, event.messageID);

  try {
    // Get user avatar with better error handling
    let Avatar;
    try {
      Avatar = (await axios.get(
        `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer", timeout: 10000 }
      )).data;
    } catch (error) {
      console.log('Avatar fetch failed, using default');
      // Use a default avatar or create a simple colored circle
      Avatar = Buffer.alloc(0);
    }

    // Get background image with fallback
    let getWanted;
    try {
      getWanted = (await axios.get(
        `https://i.ibb.co/cCpB1sQ/Ph-i-b-a-trung-thu.png`,
        { responseType: "arraybuffer", timeout: 10000 }
      )).data;
    } catch (error) {
      console.log('Background fetch failed, creating simple background');
      // Create a simple colored background
      const canvas = createCanvas(1920, 1080);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#4267B2";
      ctx.fillRect(0, 0, 1920, 1080);
      getWanted = canvas.toBuffer();
    }

    if (Avatar.length > 0) {
      fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
      avatar = await this.circle(pathAva);
    }
    
    fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    
    ctx.drawImage(baseImage, 0, 0, 1920, 1080);
    
    // Only draw avatar if it was successfully loaded
    if (Avatar.length > 0) {
      let baseAva = await loadImage(avatar);
      ctx.drawImage(baseAva, 820, 315, 283, 283);
    }
    
    ctx.font = "bold 70px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(text1, 965, 715);
    
    ctx.font = "55px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(text2, 965, 800);
    
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    
    if (fs.existsSync(pathAva)) {
      fs.removeSync(pathAva);
    }
    
    return api.sendMessage(
      { attachment: fs.createReadStream(pathImg) },
      threadID,
      () => {
        if (fs.existsSync(pathImg)) {
          fs.unlinkSync(pathImg);
        }
      },
      messageID
    );
    
  } catch (error) {
    console.log(`Cover command error: ${error.message}`);
    return api.sendMessage(
      "❌ Sorry, there was an error creating your cover image. Please try again later.",
      threadID,
      messageID
    );
  }
};
