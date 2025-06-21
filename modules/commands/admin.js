const fs = require("fs-extra");
const moment = require("moment-timezone");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "admin",
  version: "2.2.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "Show Bot Owner Info",
  commandCategory: "info",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  const now = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");
  const imageUrl = "https://i.postimg.cc/nhM2PPjW/admin.png";
  const imagePath = path.join(__dirname, "cache", `admin_${Date.now()}.png`);

  const ownerInfo =
    `╭───〔👑𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎👑〕───╮\n` +
    `┃\n` +
    `┃ 🏷️ 𝗡𝗮𝗺𝗲       : 𝙏 𝙊 𝙃 𝙄 𝘿 𝙐 𝙇 ッ\n` +
    `┃ 👨‍💼 𝗚𝗲𝗻𝗱𝗲𝗿     : 𝗠𝗮𝗹𝗲\n` +
    `┃ 💖 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻   : 𝗦𝗶𝗻𝗴𝗹𝗲\n` +
    `┃ 🎂 𝗔𝗴𝗲         : 18+\n` +
    `┃ 🕌 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻    : 𝗜𝘀𝗹𝗮𝗺\n` +
    `┃ 🎓 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻  : 𝗜𝗻𝘁𝗲𝗿 1𝘀𝘁 𝗬𝗲𝗮𝗿\n` +
    `┃ 🏠 𝗔𝗱𝗱𝗿𝗲𝘀𝘀    : 𝗧𝗵𝗮𝗸𝘂𝗿𝗴𝗮𝗼𝗻, 𝗕𝗮𝗻𝗴𝗹𝗮𝗱𝗲𝘀𝗵\n` +
    `┃\n` +
    `┣━━━〔 🌐 𝗦𝗢𝗖𝗜𝗔𝗟 𝗟𝗜𝗡𝗞𝗦 〕━━━┫\n` +
    `┃ 🎭 TikTok    : -----------\n` +
    `┃ ✈️ Telegram  : https://t.me/NFTTOHIDUL19\n` +
    `┃ 🌍 Facebook  : https://www.facebook.com/profile.php?id=100092006324917\n` +
    `┃\n` +
    `┣━━━〔 ⏰ 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𝗧𝗜𝗠𝗘 〕━━━┫\n` +
    `┃ 🕒 ${now}\n` +
    `╰───────────────────────────╯\n` +
    `💌 𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚 𝑻𝑶𝑯𝑰𝑫𝑼𝑳 𝑩𝑶𝑻`;

  let loadingMsg;
  try {
    // Step 1: Send loading message (initial 45%)
    loadingMsg = await api.sendMessage(
      "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨...\n\n[▓▓░░░░░░░░░░] 45%",
      threadID
    );
    // Step 2: edit loading bar (super fast step)
    setTimeout(() => {
      api.editMessage(
        "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨...\n\n[▓▓▓▓▓▓░░░░░░] 75%",
        loadingMsg.messageID,
        threadID
      );
    }, 100);

    setTimeout(() => {
      api.editMessage(
        "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨...\n\n[▓▓▓▓▓▓▓▓▓▓▓░] 95%",
        loadingMsg.messageID,
        threadID
      );
    }, 200);

    // Step 3: Final 100% and process info
    setTimeout(async () => {
      try {
        await api.editMessage(
          "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨...\n\n[▓▓▓▓▓▓▓▓▓▓▓▓] 100%",
          loadingMsg.messageID,
          threadID
        );
        // Download image
        const response = await axios({
          url: imageUrl,
          method: 'GET',
          responseType: 'stream',
          timeout: 10000
        });

        // Ensure cache directory exists
        const cacheDir = path.dirname(imagePath);
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

        // Write image to cache
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Unsend loading bar and send real info+image
        await api.unsendMessage(loadingMsg.messageID);

        await api.sendMessage({
          body: ownerInfo,
          attachment: fs.createReadStream(imagePath)
        }, threadID, () => {
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        });

      } catch (error) {
        await api.unsendMessage(loadingMsg.messageID);
        await api.sendMessage(ownerInfo + "\n\n[⛔] ছবি ডাউনলোডে সমস্যা হয়েছে!", threadID, messageID);
      }
    }, 350);

  } catch (error) {
    await api.sendMessage(ownerInfo + "\n\n[⛔] লোডিং এ সমস্যা হয়েছে!", threadID, messageID);
  }
};