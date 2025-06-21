const moment = require("moment-timezone");

module.exports.config = {
  name: "info",
  version: "1.3.2",
  hasPermssion: 0,
  credits: "TOHI-BOT-HUB",
  description: "Show bot & owner info with uptime",
  usePrefix: true,
  commandCategory: "For users",
  hide: true,
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  // Config & Data
  const { configPath } = global.client;
  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);
  const PREFIX = config.PREFIX;
  const { commands } = global.client;

  // Uptime Calculation
  const time = process.uptime();
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);

  // New image link provided by user
  const imgURL = "https://i.postimg.cc/pLH8GtCZ/info.jpg";
  const imgPath = __dirname + "/cache/tohibot-info.jpg";

  // Time in BD
  const now = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

  // Stylish, emoji, font & shape message
  const msg =
`╭━━━━━━━━━━━━━━━━━━━━━━╮
┃   🤖 𝑻𝑶𝑯𝑰-𝑩𝑶𝑻 𝑰𝑵𝑭𝑶 🤖
┣━━━━━━━━━━━━━━━━━━━━━━┫
┃ 𝙋𝙧𝙚𝙛𝙞𝙭 : 『 ${PREFIX} 』
┃ 𝙈𝙤𝙙𝙪𝙡𝙚𝙨 : ${commands.size}
┃ 𝙐𝙥𝙩𝙞𝙢𝙚 : ${hours}ʜ ${minutes}ᴍ ${seconds}s
┃ 𝙊𝙬𝙣𝙚𝙧 : 𝑻𝑶𝑯𝑰𝑫𝑼𝑳
┃ 𝙁𝘽 : fb.com/profile.php?id=100092006324917
┃ 🕒 𝙏𝙞𝙢𝙚 : ${now}
╰━━━━━━━━━━━━━━━━━━━━━━╯
🌟 𝑻𝒉𝒂𝒏𝒌𝒔 𝒇𝒐𝒓 𝒖𝒔𝒊𝒏𝒈 𝑻𝑶𝑯𝑰-𝑩𝑶𝑻! 🌟`;

  // Loading bar
  let loadingMsg;
  try {
    loadingMsg = await api.sendMessage(
      "⏳ 𝐈𝐧𝐟𝐨 𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n\n[▓▓░░░░░░░░░░] 45%",
      event.threadID
    );
    setTimeout(() => {
      api.editMessage("⏳ 𝐈𝐧𝐟𝐨 𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n\n[▓▓▓▓▓▓░░░░░░] 75%", loadingMsg.messageID, event.threadID);
    }, 100);
    setTimeout(() => {
      api.editMessage("⏳ 𝐈𝐧𝐟𝐨 𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n\n[▓▓▓▓▓▓▓▓▓▓▓░] 95%", loadingMsg.messageID, event.threadID);
    }, 200);
    setTimeout(() => {
      api.editMessage("⏳ 𝐈𝐧𝐟𝐨 𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n\n[▓▓▓▓▓▓▓▓▓▓▓▓] 100%", loadingMsg.messageID, event.threadID);
    }, 300);

    // Download image and send result after loading
    setTimeout(() => {
      request(encodeURI(imgURL))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", async () => {
          await api.unsendMessage(loadingMsg.messageID);
          api.sendMessage(
            {
              body: msg,
              attachment: fs.createReadStream(imgPath),
            },
            event.threadID,
            () => fs.unlinkSync(imgPath)
          );
        });
    }, 420);

  } catch (error) {
    api.sendMessage(msg, event.threadID);
  }
};