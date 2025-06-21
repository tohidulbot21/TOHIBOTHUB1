module.exports.config = {
  name: "uptime",
  version: "4.0.0",
  permission: 0,
  usePrefix: true,
  commandCategory: "system",
  credits: "TOHI-BOT-HUB ",
  aliases: ["upt", "ut", "status"]
};

function byte2mb(bytes) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  let l = 0, n = parseInt(bytes, 10) || 0;
  while (n >= 1024 && ++l) n = n / 1024;
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;

  // Step 1: Send first loading message (45%)
  const loading = await api.sendMessage("TOHI-BOT UPTIME LOADING... [▓▓░░] 45%", threadID);

  // Step 2: Edit to 75%
  setTimeout(() => {
    api.editMessage("TOHI-BOT UPTIME LOADING... [▓▓▓▓▓░] 75%", loading.messageID, threadID);
  }, 400);

  // Step 3: Edit to 100%
  setTimeout(() => {
    api.editMessage("TOHI-BOT UPTIME LOADING... [▓▓▓▓▓▓▓▓] 100%", loading.messageID, threadID);
  }, 700);

  // Step 4: Edit to final status
  setTimeout(() => {
    // Calculate uptime
    const time = process.uptime();
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const moment = require("moment-timezone");
    const timeNow = moment.tz("Asia/Dhaka").format("DD/MM/YYYY | HH:mm:ss");
    const { commands } = global.client;
    const prefix = global.config.PREFIX || '.';
    const botName = global.config.BOTNAME || "TOHI-BOT";
    let stats = { cpu: 0, memory: 0 };
    try {
      const pidusage = require("pidusage");
      stats = require("pidusage").sync
        ? require("pidusage").sync(process.pid)
        : { cpu: 0, memory: 0 };
    } catch (error) {}
    let msg = `
┏━━ 𝙏𝙊𝙃𝙄-𝘽𝙊𝙏 𝙐𝙋𝙏𝙄𝙈𝙀 ━━┓
🟢 Status: ONLINE
⏰ Uptime: ${hours}h ${minutes}m ${seconds}s
📅 Date: ${timeNow}
📂 Commands: ${commands.size}
👥 Users: ${global.data.allUserID.length}
💬 Threads: ${global.data.allThreadID.length}
🧠 CPU: ${stats.cpu ? stats.cpu.toFixed(1) : "0"}%
💾 RAM: ${stats.memory ? byte2mb(stats.memory) : "0 MB"}
🌐 Ping: ${Date.now() - event.timestamp}ms
┗━━━━━━━━━━━━━━━━━━┛
`;
    api.editMessage(msg, loading.messageID, threadID);
  }, 1000);
};