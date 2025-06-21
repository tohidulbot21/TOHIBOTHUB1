const fs = require('fs-extra');
const pathFile = __dirname + '/cache/autoseen.txt';

module.exports.config = {
  name: "autoseen",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TOHI-BOT-HUB", // Credit updated!
  description: "Turn on/off auto seen for new messages",
  usePrefix: true,
  commandCategory: "Admin",
  usages: "on/off",
  cooldowns: 5,
};

const messages = {
  on: "🤖 AutoSeen এখন চালু করা হয়েছে! এখন থেকে নতুন মেসেজ আসলে বট নিজে নিজেই সীন দিবে।\n\n🛠️ Made by TOHIDUL",
  off: "🤖 AutoSeen এখন বন্ধ করা হয়েছে! নতুন মেসেজ আসলেও বট আর সীন দিবে না।\n\n🛠️ Made by TOHIDUL",
  error: "❌ কমান্ড ভুল! সঠিকভাবে ব্যবহার করুন: autoseen on/off\n\n🛠️ Made by TOHIDUL"
};

module.exports.handleEvent = async ({ api, event }) => {
  if (!fs.existsSync(pathFile)) fs.writeFileSync(pathFile, 'false');
  const isEnable = fs.readFileSync(pathFile, 'utf-8');
  if (isEnable == 'true') {
    api.markAsReadAll(() => {});
  }
};

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args[0] == 'on') {
      fs.writeFileSync(pathFile, 'true');
      api.sendMessage(messages.on, event.threadID, event.messageID);
    } else if (args[0] == 'off') {
      fs.writeFileSync(pathFile, 'false');
      api.sendMessage(messages.off, event.threadID, event.messageID);
    } else {
      api.sendMessage(messages.error, event.threadID, event.messageID);
    }
  } catch(e) {
    console.log(e);
  }
};
