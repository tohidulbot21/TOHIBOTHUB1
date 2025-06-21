const config = require(process.cwd() + "/config.json");

module.exports.config = {
  name: "avt",
  version: "1.0.0",
  permission: 0,
  credits: "TOHI-BOT-HUB",
  description: "Get avatar picture of user, group, or by link/uid",
  usePrefix: true,
  commandCategory: "user",
  usages: "",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = async function({ api, event, args, Threads }) {
  const request = require("request");
  const fs = require("fs");
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : config.prefix;
  const mn = this.config.name;
  const botName = config.name || "TOHI-BOT";

  // Stylish font for bot name
  function toFancyFont(str) {
    return str
      .replace(/A/gi, "𝑨").replace(/B/gi, "𝑩").replace(/C/gi, "𝑪").replace(/D/gi, "𝑫")
      .replace(/E/gi, "𝑬").replace(/F/gi, "𝑭").replace(/G/gi, "𝑮").replace(/H/gi, "𝑯")
      .replace(/I/gi, "𝑰").replace(/J/gi, "𝑱").replace(/K/gi, "𝑲").replace(/L/gi, "𝑳")
      .replace(/M/gi, "𝑴").replace(/N/gi, "𝑵").replace(/O/gi, "𝑶").replace(/P/gi, "𝑷")
      .replace(/Q/gi, "𝑸").replace(/R/gi, "𝑹").replace(/S/gi, "𝑺").replace(/T/gi, "𝑻")
      .replace(/U/gi, "𝑼").replace(/V/gi, "𝑽").replace(/W/gi, "𝑾").replace(/X/gi, "𝑿")
      .replace(/Y/gi, "𝒀").replace(/Z/gi, "𝒁")
      .replace(/a/g, "𝒂").replace(/b/g, "𝒃").replace(/c/g, "𝒄").replace(/d/g, "𝒅")
      .replace(/e/g, "𝒆").replace(/f/g, "𝒇").replace(/g/g, "𝒈").replace(/h/g, "𝒉")
      .replace(/i/g, "𝒊").replace(/j/g, "𝒋").replace(/k/g, "𝒌").replace(/l/g, "𝒍")
      .replace(/m/g, "𝒎").replace(/n/g, "𝒏").replace(/o/g, "𝒐").replace(/p/g, "𝒑")
      .replace(/q/g, "𝒒").replace(/r/g, "𝒓").replace(/s/g, "𝒔").replace(/t/g, "𝒕")
      .replace(/u/g, "𝒖").replace(/v/g, "𝒗").replace(/w/g, "𝒘").replace(/x/g, "𝒙")
      .replace(/y/g, "𝒚").replace(/z/g, "𝒛");
  }
  const fancyBotName = toFancyFont(botName);

  // Check for mentions first
  if (Object.keys(event.mentions).length > 0) {
    let mentionID = Object.keys(event.mentions)[0];
    let callback = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/avt_mention.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt_mention.png"), event.messageID);
    return request(encodeURI(`https://graph.facebook.com/${mentionID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + "/cache/avt_mention.png")).on('close', callback);
  }

  // Group avatar
  if (args[0] == "box") {
    let groupID = args[1] ? args[1] : event.threadID;
    let threadInfo = await api.getThreadInfo(groupID);
    let img = threadInfo.imageSrc;
    if (!img) return api.sendMessage(`[🖼️] ${threadInfo.threadName} গ্রুপের কোন এভাটার নেই!`, event.threadID, event.messageID);
    let callback = () => api.sendMessage({body: `[🖼️] ${threadInfo.threadName} গ্রুপের এভাটার:`, attachment: fs.createReadStream(__dirname + "/cache/avt_box.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt_box.png"), event.messageID);
    return request(encodeURI(img)).pipe(fs.createWriteStream(__dirname + "/cache/avt_box.png")).on('close', callback);
  }

  // Check if it's a Facebook link
  if (args[0] && args[0].includes("facebook.com")) {
    try {
      const tool = require("fb-tools");
      let id = await tool.findUid(args[0]);
      let callback = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/avt_link.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt_link.png"), event.messageID);
      if (!id) return api.sendMessage(`[🖼️] ইউজার পাওয়া যায়নি!`, event.threadID, event.messageID);
      return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + "/cache/avt_link.png")).on('close', callback);
    } catch (e) {
      return api.sendMessage(`[🖼️] ইউজার পাওয়া যায়নি!`, event.threadID, event.messageID);
    }
  }

  // Check if it's a User ID (numeric)
  if (args[0] && /^\d+$/.test(args[0])) {
    let id = args[0];
    let callback = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/avt_uid.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt_uid.png"), event.messageID);
    return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + "/cache/avt_uid.png")).on('close', callback);
  }

  // Show help if wrong usage
  return api.sendMessage(
    `╭─╼⃝⸙͎༄❀ 𝑨𝒗𝒂𝒕𝒂𝒓 𝑴𝒆𝒏𝒖 ❀༄⸙⃝╾─╮\n`
    + `🤖 ${fancyBotName}\n\n`
    + `💠  ${prefix}${mn} - Your avatar\n`
    + `💠  ${prefix}${mn} @mention - Someone's avatar\n`
    + `💠  ${prefix}${mn} [UserID] - Avatar by ID\n`
    + `💠  ${prefix}${mn} [ProfileLink] - Avatar by link\n`
    + `💠  ${prefix}${mn} box - Group avatar\n`
    + `╰─⃝⸙͎༄❀ ${fancyBotName} ❀༄⸙⃝─╯`,
    event.threadID, event.messageID
  );
}