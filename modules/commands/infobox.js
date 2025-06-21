module.exports.config = {
  name: "infobox",
  version: "1.0",
  hasPermssion: 0,
  credits: "Made by Tohidul",
  description: "Search for group (box) or user information by ID",
  commandCategory: "Information",
  usages: "[boxID (optional)]",
  cooldowns: 5,
  usePrefix: true
};

const request = require('request');
const fs = require('fs-extra');

module.exports.run = async ({ event, api, args, Users }) => {    
  let boxID = args[0] || event.threadID;

  let threadInfo;
  try {
      threadInfo = await api.getThreadInfo(boxID);
  } catch (e) {
      return api.sendMessage("❌ Unable to find information for this box. Please check the ID and try again.", event.threadID, event.messageID);
  }

  const memberCount = threadInfo.participantIDs.length;
  let maleCount = 0, femaleCount = 0, unknownCount = 0;
  let maleNames = [], femaleNames = [], unknownNames = [];

  for (const userInfo of threadInfo.userInfo) {
      if (userInfo.gender === 'MALE') {
          maleCount++;
          maleNames.push(userInfo.name);
      } else if (userInfo.gender === 'FEMALE') {
          femaleCount++;
          femaleNames.push(userInfo.name);
      } else {
          unknownCount++;
          unknownNames.push(userInfo.name);
      }
  }

  const adminIDs = threadInfo.adminIDs;
  let adminList = '';
  for (let admin of adminIDs) {
      let name = (await Users.getData(admin.id)).name;
      adminList += `• ${name}\n`;
  }

  const threadName = threadInfo.threadName || "No name";
  const id = threadInfo.threadID;
  const emoji = threadInfo.emoji || "❔";
  const approval = threadInfo.approvalMode ? "Enabled ✅" : "Disabled ❎";
  const messageCount = threadInfo.messageCount;

  // Prepare avatar download and response
  const callback = () => api.sendMessage({
      body: `🦋 Group Name: ${threadName}\n` +
            `⚜️ Box ID: ${id}\n` +
            `🌹 Approval Mode: ${approval}\n` +
            `☠ Emoji: ${emoji}\n` +
            `📌 Info:\n` +
            `🌈 Total Members: ${memberCount}\n` +
            `👨‍🦰 Male: ${maleCount}\n` +
            `👩‍🦰 Female: ${femaleCount}\n` +
            `❔ Unknown: ${unknownCount}\n\n` +
            `🌸 Total Admins: ${adminIDs.length}\n${adminList}` +
            `📩 Total Messages: ${messageCount}`,
      attachment: fs.createReadStream(__dirname + "/cache/box_avatar.png")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/box_avatar.png"), event.messageID);

  // Download box avatar and send info
  if (threadInfo.imageSrc) {
      request(encodeURI(threadInfo.imageSrc))
          .pipe(fs.createWriteStream(__dirname + '/cache/box_avatar.png'))
          .on('close', callback);
  } else {
      api.sendMessage({
          body: `🦋 Group Name: ${threadName}\n` +
                `⚜️ Box ID: ${id}\n` +
                `🌹 Approval Mode: ${approval}\n` +
                `☠ Emoji: ${emoji}\n` +
                `📌 Info:\n` +
                `🌈 Total Members: ${memberCount}\n` +
                `👨‍🦰 Male: ${maleCount}\n` +
                `👩‍🦰 Female: ${femaleCount}\n` +
                `❔ Unknown: ${unknownCount}\n\n` +
                `🌸 Total Admins: ${adminIDs.length}\n${adminList}` +
                `📩 Total Messages: ${messageCount}`,
      }, event.threadID, event.messageID);
  }
};