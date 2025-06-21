module.exports.config = {
  name: "prefix",
  version: "1.0.7",
  hasPermssion: 0,
  credits: "TOHI-BOT-HUB",
  description: "🔥 স্টাইলিশ প্রিফিক্স গ্রিটিং! 🚀",
  usePrefix: true,
  commandCategory: "system",
  usages: "",
  cooldowns: 3
};

const boxTop = "╔════════════════════════╗";
const boxBot = "╚════════════════════════╝";
const boxBar = " ";
const pad = (txt) => txt.padEnd(31, " ");
const line = (txt) => `${boxBar} ${pad(txt)}${boxBar}`;

// Function to convert text to stylish font
function toStylishFont(text) {
  let stylishText = "";
  const fontMapping = {
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺',
    'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠',
    'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭'
  };

  for (const char of text) {
    stylishText += fontMapping[char] || char;
  }

  return stylishText;
}

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  const prefix = global.config.PREFIX || "/";

  if (!body) return;
  const trimmedBody = body.trim().toLowerCase();

  // Respond to both exact prefix and "prefix" text
  if (trimmedBody !== prefix && trimmedBody !== "prefix") return;

  const botName = global.config.BOTNAME || "TOHI-BOT";
  const stylishBotName = toStylishFont(botName);
  const stylishOwner = toStylishFont("TOHIDUL");

  const message = [
    boxTop,
    line(""),
    line(`✨ 𝗕𝗢𝗧: ${stylishBotName} ✨`),
    line(""),
    line(`🔥 𝗣𝗿𝗲𝗳𝗶𝘅: [ ${prefix} ] 🔥`),
    line(""),
    line(`👑 𝗢𝘄𝗻𝗲𝗿: ${stylishOwner} 👑`),
    line(""),
    boxBot
  ].join("\n");

  return api.sendMessage(message, threadID, messageID);
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const prefix = global.config.PREFIX || "/";

  const botName = global.config.BOTNAME || "TOHI-BOT";
  const stylishBotName = toStylishFont(botName);
  const stylishOwner = toStylishFont("TOHIDUL");

  const message = [
    boxTop,
    line(""),
    line(`✨ 𝗕𝗢𝗧: ${stylishBotName} ✨`),
    line(""),
    line(`🔥 𝗣𝗿𝗲𝗳𝗶𝘅: [ ${prefix} ] 🔥`),
    line(""),
    line(`👑 𝗢𝘄𝗻𝗲𝗿: ${stylishOwner} 👑`),
    line(""),
    boxBot
  ].join("\n");

  return api.sendMessage(message, threadID, messageID);
};