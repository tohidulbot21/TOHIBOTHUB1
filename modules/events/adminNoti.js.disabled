
module.exports.config = {
  name: "admin noti",
  eventType: [], // Disabled - conflicts with manual approval system
  version: "1.2.0",
  credits: "TOHI-BOT-HUB, improved by TOHIDUL",
  description: "Stylish Admin Group Update Notification with Rate Limit Handling - DISABLED"
};

const ADMIN = 'TOHIDUL';
const FB_LINK = 'https://web.facebook.com/mdtohidulislam063';

const fs = require('fs-extra');
const { loadImage, createCanvas, registerFont } = require("canvas");
const { apiCallWithRetry } = require("../../utils/apiHelper");
const moment = require("moment-timezone");

const fontlink = 'https://drive.google.com/u/0/uc?id=1ZwFqYB-x6S9MjPfYm3t3SP1joohGl4iw&export=download'
let PRFX = `${global.config.PREFIX}`;

module.exports.circle = async (image) => {
  try {
    const img = await Jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
  } catch (error) {
    console.error('Circle processing error:', error.message);
    throw error;
  }
}

module.exports.run = async function({ api, event, Users }) {
  try {
    // Session & Time
    var getHours = await global.client.getTime("hours");
    var session;
    if (getHours < 3) session = "🌙 মধ্যরাত";
    else if (getHours < 8) session = "🌅 ভোর";
    else if (getHours < 12) session = "☀️ সকাল";
    else if (getHours < 17) session = "🌤️ দুপুর";
    else if (getHours < 23) session = "🌆 সন্ধ্যা";
    else session = "🌙 মধ্যরাত";

    const thu = moment.tz('Asia/Dhaka').format('dddd');
    const time = moment.tz("Asia/Dhaka").format("HH:mm:ss - DD/MM/YYYY");
    const { commands } = global.client;
    const { threadID } = event;
    let threadInfo = await api.getThreadInfo(threadID);
    let threadName = threadInfo.threadName;

    if (!event.logMessageData.addedParticipants || !Array.isArray(event.logMessageData.addedParticipants)) return;

    // If bot is added to group
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
      let msg = `✨ হ্যালো সবাই! আমি 🤖 ${global.config.BOTNAME || "BOT"}\n\n✅ ${threadName} গ্রুপে কানেক্টেড!\n\n🔸 মোট কমান্ড: ${commands.size}\n🔸 Prefix: ${global.config.PREFIX}\n🔸 ভার্সন: ${global.config.version}\n🔸 এডমিন: ${ADMIN}\n🔸 ফেসবুক: ${FB_LINK}\n🔸 ${PRFX}help লিখে কমান্ড দেখুন\n🕓 যুক্ত হইল: ${time} (${thu})\n\n🚩 Made by TOHIDUL`;
      
      // Try to download GIF with better error handling
      let gifPath = __dirname + '/cache/join/join.gif';
      let attachment = null;
      
      try {
        // Check if GIF already exists to avoid repeated downloads
        if (!fs.existsSync(gifPath)) {
          let gifUrl = 'https://i.imgur.com/4HMupHz.gif';
          console.log('Downloading welcome GIF...');
          const response = await apiCallWithRetry(gifUrl, { responseType: 'arraybuffer' }, 3);
          fs.writeFileSync(gifPath, response.data);
          console.log('Welcome GIF downloaded successfully');
        }
        
        if (fs.existsSync(gifPath)) {
          attachment = fs.createReadStream(gifPath);
        }
      } catch (error) {
        console.log('Could not download welcome GIF, proceeding without it:', error.message);
        // Continue without attachment
      }
      
      return api.sendMessage({ 
        body: msg, 
        attachment: attachment 
      }, threadID);
    }

    // New user(s) added to group
    try {
      // Font check/download
      if (!fs.existsSync(__dirname + `/cache/font/Semi.ttf`)) {
        try {
          let getfont = await apiCallWithRetry(fontlink, { responseType: "arraybuffer" }, 3);
          fs.writeFileSync(__dirname + `/cache/font/Semi.ttf`, Buffer.from(getfont.data, "utf-8"));
        } catch (fontError) {
          console.error('Font download error:', fontError.message);
        }
      }

      let { participantIDs } = threadInfo;
      let threadData = global.data.threadData.get(parseInt(threadID)) || {};
      let mentions = [], nameArray = [], memLength = [], iduser = [], abx = [];
      let i = 0;

      for (let user of event.logMessageData.addedParticipants) {
        const userName = user.fullName; 
        iduser.push(user.userFbId.toString());
        nameArray.push(userName);
        mentions.push({ tag: userName, id: user.userFbId });
        memLength.push(participantIDs.length - i++);
      }

      // Image processing with enhanced error handling
      for (let o = 0; o < event.logMessageData.addedParticipants.length; o++) {
        try {
          let pathImg = __dirname + `/cache/join/${o}.png`;
          let pathAva = __dirname + `/cache/join/avt.png`;
          
          // Ensure cache directory exists
          if (!fs.existsSync(__dirname + `/cache/join/`)) {
            fs.mkdirSync(__dirname + `/cache/join/`, { recursive: true });
          }
          
          let avtAnime, background;
          
          try {
            avtAnime = await apiCallWithRetry(
              `https://graph.facebook.com/${event.logMessageData.addedParticipants[o].userFbId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
              { responseType: "arraybuffer" },
              3
            );
          } catch (avatarError) {
            console.log(`Avatar download failed for user ${o}, using default`);
            // Create a simple default avatar
            const canvas = createCanvas(720, 720);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#4267B2';
            ctx.fillRect(0, 0, 720, 720);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 200px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('?', 360, 400);
            avtAnime = { data: canvas.toBuffer() };
          }
          
          let backgrounds = [
            'https://i.imgur.com/dDSh0wc.jpeg',
            'https://i.imgur.com/UucSRWJ.jpeg',
            'https://i.imgur.com/OYzHKNE.jpeg',
            'https://i.imgur.com/V5L9dPi.jpeg',
            'https://i.imgur.com/M7HEAMA.jpeg'
          ];
          
          try {
            background = await apiCallWithRetry(
              backgrounds[Math.floor(Math.random() * backgrounds.length)], 
              { responseType: "arraybuffer" },
              3
            );
          } catch (bgError) {
            console.log(`Background download failed, using default`);
            // Create a simple gradient background
            const canvas = createCanvas(1902, 1082);
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 1902, 1082);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1902, 1082);
            background = { data: canvas.toBuffer() };
          }
          
          fs.writeFileSync(pathAva, Buffer.from(avtAnime.data, "utf-8"));
          fs.writeFileSync(pathImg, Buffer.from(background.data, "utf-8"));
          let avatar = await this.circle(pathAva);
          let baseImage = await loadImage(pathImg);
          let baseAva = await loadImage(avatar);

          if (fs.existsSync(__dirname + `/cache/font/Semi.ttf`)) {
            registerFont(__dirname + `/cache/font/Semi.ttf`, { family: "Semi" });
          }
          
          let canvas = createCanvas(1902, 1082);
          let ctx = canvas.getContext("2d");
          ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(baseAva, canvas.width / 2 - 188, canvas.height / 2 - 375, 375, 355);

          // Stylish text
          ctx.fillStyle = "#FFF";
          ctx.textAlign = "center";
          ctx.font = `bold 120px ${fs.existsSync(__dirname + `/cache/font/Semi.ttf`) ? 'Semi' : 'Arial'}`;
          ctx.fillText(`👋 ${event.logMessageData.addedParticipants[o].fullName}`, canvas.width / 2, canvas.height / 2 + 70);

          ctx.font = `bold 75px ${fs.existsSync(__dirname + `/cache/font/Semi.ttf`) ? 'Semi' : 'Arial'}`;
          ctx.fillStyle = "#FFD700";
          ctx.fillText(`🎉 ${threadName} গ্রুপে স্বাগতম!`, canvas.width / 2, canvas.height / 2 + 180);

          // Suffix logic
          const number = participantIDs.length - o;
          const suffix = (number === 11 || number === 12 || number === 13) ? "th" : (["st", "nd", "rd"][(number % 10) - 1] || "th");
          ctx.fillStyle = "#00FFCC";
          ctx.font = `bold 60px ${fs.existsSync(__dirname + `/cache/font/Semi.ttf`) ? 'Semi' : 'Arial'}`;
          ctx.fillText(`আপনি গ্রুপের ${number}${suffix} সদস্য!`, canvas.width / 2, canvas.height / 2 + 260);

          ctx.font = `bold 45px ${fs.existsSync(__dirname + `/cache/font/Semi.ttf`) ? 'Semi' : 'Arial'}`;
          ctx.fillStyle = "#FFF";
          ctx.fillText(`🕓 ${time} (${thu})`, canvas.width / 2, canvas.height / 2 + 330);

          ctx.font = `bold 35px ${fs.existsSync(__dirname + `/cache/font/Semi.ttf`) ? 'Semi' : 'Arial'}`;
          ctx.fillStyle = "#FF69B4";
          ctx.fillText(`🚩 Made by TOHIDUL`, canvas.width / 2, canvas.height / 2 + 400);

          const imageBuffer = canvas.toBuffer();
          fs.writeFileSync(pathImg, imageBuffer);
          abx.push(fs.createReadStream(pathImg));
        } catch (imageError) {
          console.error(`Image processing error for user ${o}:`, imageError);
          // Continue without image for this user
        }
      }

      // Custom message
      let nameAuthor = await Users.getNameUser(event.author);
      let msg = `👤 নতুন সদস্য: ${nameArray.join(', ')}\n\n🌟 গ্রুপ: ${threadName}\n🌐 প্রোফাইল: https://facebook.com/profile.php?id=${iduser.join(', ')}\n🎊 এখন আমাদের সদস্য সংখ্যা: ${participantIDs.length}\n👮‍♂️ যিনি এড করেছেন: ${nameAuthor}\n\n${session}\n🕓 ${time} (${thu})\n\n🚩 Made by TOHIDUL`;
      if (typeof threadData.customJoin !== "undefined") msg = threadData.customJoin;

      try {
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        api.sendMessage({ body: msg, attachment: abx, mentions }, threadID);
      } catch (sendError) {
        console.error('Failed to send welcome message:', sendError.message);
        // Try sending without attachments if it fails
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          api.sendMessage({ body: msg, mentions }, threadID);
        } catch (fallbackError) {
          console.error('Fallback message also failed:', fallbackError.message);
          // Final fallback - simple message without mentions
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            api.sendMessage(`Welcome to the group!`, threadID);
          } catch (finalError) {
            console.error('All message attempts failed:', finalError.message);
          }
        }
      }

      // Clean temp images
      for (let ii = 0; ii < event.logMessageData.addedParticipants.length; ii++) {
        try {
          if (fs.existsSync(__dirname + `/cache/join/${ii}.png`)) {
            fs.unlinkSync(__dirname + `/cache/join/${ii}.png`);
          }
        } catch (cleanupError) {
          console.error(`Cleanup error for image ${ii}:`, cleanupError);
        }
      }
    } catch (e) {
      console.error('AdminNoti processing error:', e);
    }
  } catch (error) {
    console.error('AdminNoti main error:', error);
  }
}
